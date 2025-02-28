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
pub fn get_auth() -> Auth {
    let mut db = get_leveldb_connection();

    let auth = db.get(b"auth").unwrap();
    let auth: Auth = serde_json::from_slice(&auth).unwrap();

    db.close().unwrap();

    auth
}
