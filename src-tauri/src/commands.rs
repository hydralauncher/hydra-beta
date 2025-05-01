use rusty_leveldb::{Options, DB};
use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Serialize, Deserialize)]
pub struct Auth {
    #[serde(rename = "accessToken")]
    access_token: String,
    #[serde(rename = "refreshToken")]
    refresh_token: String,
    #[serde(rename = "tokenExpirationTimestamp")]
    token_expiration_timestamp: u64,
}

fn get_leveldb_connection() -> DB {
    let config_dir = dirs::config_dir().unwrap();
    let app_data_dir = config_dir.join("hydralauncher").join("hydra-db-staging");
    DB::open(app_data_dir, Options::default()).unwrap()
}

#[command]
pub fn get_legacy_auth() -> Auth {
    let mut db = get_leveldb_connection();

    let auth = db.get(b"auth").unwrap();
    let auth: Auth = serde_json::from_slice(&auth).unwrap();

    db.close().unwrap();

    auth
}

#[command]
pub fn delete_legacy_auth() -> Result<(), String> {
    let mut db = get_leveldb_connection();

    db.delete(b"auth").unwrap();

    Ok(())
}

#[command]
pub fn save_password(service: String, account: String, password: String) -> Result<(), String> {
    keytar::set_password(&service, &account, &password).map_err(|e| e.to_string())
}

#[command]
pub fn get_password(service: String, account: String) -> Result<String, String> {
    match keytar::get_password(&service, &account) {
        Ok(password) => Ok(password.password),
        Err(e) => Err(e.to_string()),
    }
}

#[command]
pub fn delete_password(service: String, account: String) -> Result<bool, String> {
    keytar::delete_password(&service, &account).map_err(|e| e.to_string())
}
