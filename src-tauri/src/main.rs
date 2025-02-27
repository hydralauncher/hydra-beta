#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use rusty_leveldb::{DB, Options};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Auth {
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
  let db = DB::open(app_data_dir, Options::default()).unwrap();

  db
}

#[tauri::command]
fn get_auth() -> Auth {
  let mut db = get_leveldb_connection();

  let auth = db.get(b"auth").unwrap();
  let auth: Auth = serde_json::from_slice(&auth).unwrap();
  
  db.close().unwrap();

  auth
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_auth])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
