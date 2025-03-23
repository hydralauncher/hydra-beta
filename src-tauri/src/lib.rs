mod commands;

use commands::get_auth;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .invoke_handler(tauri::generate_handler![get_auth])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
