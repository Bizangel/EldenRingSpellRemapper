// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent, Manager, WindowBuilder};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn start_elden_override() -> i32 {
    unsafe {
        StartEldenOverride_Ext()
    }
}


#[tauri::command]
fn stop_elden_override() -> i32 {
    unsafe {
        StopEldenOverride_Ext()
    }
}

#[tauri::command]
fn is_elden_override_active() -> bool {
    unsafe {
        IsEldenOverrideActive_Ext()
    }
}

#[link(name = "elden-remapper")]
extern "C" {
    fn StartEldenOverride_Ext() -> i32;
    fn StopEldenOverride_Ext() -> i32;
    fn IsEldenOverrideActive_Ext() -> bool;
}

fn main() {
    let open = CustomMenuItem::new("open".to_string(), "Open Interface");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");

    let tray_menu = SystemTrayMenu::new()
        .add_item(open)
        .add_item(quit); // insert the menu items here

    let system_tray = SystemTray::new()
      .with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
              position: _,
              size: _,
              ..
            } => {
              println!("system tray received a left click");
            }
            SystemTrayEvent::RightClick {
              position: _,
              size: _,
              ..
            } => {
              println!("system tray received a right click");
            }
            SystemTrayEvent::DoubleClick {
              position: _,
              size: _,
              ..
            } => {
              println!("system tray received a double click");
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
              match id.as_str() {
                "quit" => {
                  std::process::exit(0);
                }
                "open" => {
                    let window_label = "main";
                        if let Some(window) = app.get_window(window_label) {
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        } else {
                            let main_window = WindowBuilder::new(
                                app,
                                window_label,
                                tauri::WindowUrl::App("index.html".into())
                            ).build().unwrap();
                            main_window.show().unwrap();
                            main_window.set_focus().unwrap();
                        }
                }
                _ => {}
              }
            }
            _ => {}
          })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![start_elden_override, stop_elden_override, is_elden_override_active])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
