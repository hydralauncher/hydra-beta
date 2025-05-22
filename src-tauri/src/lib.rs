mod level;

use level::{delete_leveldb_item, get_leveldb_item, set_leveldb_item};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }));
    }

    builder
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
