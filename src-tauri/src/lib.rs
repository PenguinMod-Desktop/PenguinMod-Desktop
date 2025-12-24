// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use chrono;
use std::{path::PathBuf, sync::Mutex};
use tauri::{AppHandle, Manager, State};
use tauri_plugin_log;

struct SetupState {
    frontend_init_task: bool,
    frontend_load_task: bool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_process::init())
        .manage(Mutex::new(SetupState {
            frontend_init_task: false,
            frontend_load_task: false,
        }))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::LogDir {
                        file_name: Some(
                            chrono::Local::now().format("%Y-%m-%d_%H-%M-%S").to_string(),
                        ),
                    }),
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Stdout),
                ])
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(tauri::generate_handler![create_main_window, set_complete])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn set_complete(
    app: AppHandle,
    state: State<'_, Mutex<SetupState>>,
    task: String,
) -> Result<(), ()> {
    // Lock the state without write access
    let mut state_lock = state.lock().unwrap();
    match task.as_str() {
        "frontend_init" => state_lock.frontend_init_task = true,
        "frontend_load" => state_lock.frontend_load_task = true,
        _ => panic!("invalid task completed!"),
    }
    // Check if both tasks are completed
    if state_lock.frontend_init_task && state_lock.frontend_load_task {
        // Setup is complete, we can close the splashscreen
        // and unhide the main window!
        let splash_window = app.get_webview_window("init").unwrap();
        let main_window = app.get_webview_window("main").unwrap();
        splash_window.close().unwrap();
        main_window.show().unwrap();
    }
    Ok(())
}

#[tauri::command]
async fn create_main_window(app: AppHandle, deep_link: Option<String>) -> Result<(), ()> {
    let mut config = app.config().app.windows.get(1).cloned().unwrap();

    if let Some(link) = deep_link {
        log::info!("deep link: {}", link);
        if let Some(project_id) = link.strip_prefix("penguinmod:projects/") {
            config.url = tauri::WebviewUrl::App(PathBuf::from(format!("fullscreen.html#{}", project_id)));
        }
        if let Some(project_url) = link.strip_prefix("penguinmod:project/") {
            config.url = tauri::WebviewUrl::App(PathBuf::from(format!("fullscreen.html?project_url={}", project_url)));
        }
    }

    tauri::WebviewWindowBuilder::from_config(&app, &config)
        .unwrap()
        .build()
        .unwrap();

    log::info!("created main window");
    Ok(())
}
