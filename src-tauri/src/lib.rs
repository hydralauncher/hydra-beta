mod level;

use level::{delete_leveldb_item, get_leveldb_item, set_leveldb_item};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            get_leveldb_item,
            set_leveldb_item,
            delete_leveldb_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
