use rusty_leveldb::{Options, DB};
use tauri::command;

fn get_leveldb_connection() -> DB {
    let config_dir = dirs::config_dir().unwrap();
    let app_data_dir = config_dir
        .join("hydralauncher")
        .join("hydra-beta-db-staging");
    DB::open(app_data_dir, Options::default()).unwrap()
}

#[command]
pub fn get_leveldb_item(key: &str) -> Option<String> {
    let mut db = get_leveldb_connection();
    let value = match db.get(key.as_bytes()) {
        Some(value) => value,
        None => return None,
    };
    Some(String::from_utf8(value).unwrap())
}

#[command]
pub fn set_leveldb_item(key: &str, value: &str) {
    let mut db = get_leveldb_connection();
    db.put(key.as_bytes(), value.as_bytes()).unwrap();
}

#[command]
pub fn delete_leveldb_item(key: &str) {
    let mut db = get_leveldb_connection();
    db.delete(key.as_bytes()).unwrap();
}
