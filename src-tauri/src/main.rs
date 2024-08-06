// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::ffi::{CStr, CString};
use std::os::raw::{c_char};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    unsafe {
        fnsrccppeldenremapper();
        // let name = CString::new("Rust 20").unwrap(); // keep in mind string lifetime needs to be valid and NOT deallocated by rust
        // let result = TestStringFunction(name.as_ptr());
        // println!("Result from C++ function: {}", result);
    }

    format!("Hello, {}! You've been greeted from Rust change!", name)
}

#[link(name = "elden-remapper")]
extern "C" {
    fn fnsrccppeldenremapper() -> i32;
    // fn TestStringFunction(name: *const c_char) -> i32;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
