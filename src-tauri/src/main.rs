// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::ffi::{CStr, CString};
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent, Manager, WindowBuilder};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
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

#[tauri::command]
fn elden_override_send_command(payload: String) -> String {
    unsafe {
        let cstr_payload = CString::new(payload).expect("Failed to create CString from given js string payload");
        let result_ptr = EldenOverrideCommand_Ext(cstr_payload.as_ptr());
        let result = CStr::from_ptr(result_ptr).to_string_lossy().into_owned(); // Convert C string to Rust String
        // Assume that result_ptr is dynamically allocated in C++ and we need to free it
        libc::free(result_ptr as *mut libc::c_void); // Ensure the memory is freed
        result
    }
}

#[link(name = "elden-remapper")]
extern "C" {
    fn StopEldenOverride_Ext() -> i32;
    fn IsEldenOverrideActive_Ext() -> bool;
    fn EldenOverrideCommand_Ext(input: *const std::os::raw::c_char) -> *const std::os::raw::c_char;
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
              // same as below, open both on click and on context menu press
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
            SystemTrayEvent::MenuItemClick { id, .. } => {
              match id.as_str() {
                "quit" => {
                    // close if needed
                    if is_elden_override_active() {
                        stop_elden_override();
                    }

                    std::process::exit(0);
                }
                "open" => {
                    // same as above
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
        .invoke_handler(tauri::generate_handler![stop_elden_override, is_elden_override_active, elden_override_send_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
