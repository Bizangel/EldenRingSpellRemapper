// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_elden_override, stop_elden_override, is_elden_override_active])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
