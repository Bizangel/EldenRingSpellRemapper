use std::env;
use std::fs;
use std::path::Path;

fn main() {
    // Path to the source file
    let src_dll = Path::new("../src-cpp/x64/Release/elden-remapper.dll");
    let src_lib = Path::new("../src-cpp/x64/Release/elden-remapper.lib");

    // Path to the current working directory
    let current_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
    let dest_dll = Path::new(&current_dir).join("elden-remapper.dll");
    let dest_lib = Path::new(&current_dir).join("elden-remapper.lib");

    if !src_dll.exists() {
        panic!("Source file {} not found. Have you compiled src-cpp (Release) first?", src_dll.display());
    }

    if !src_lib.exists() {
        panic!("Source file {} not found. Have you compiled src-cpp (Release) first?", src_lib.display());
    }

    // Copy the files
    fs::copy(src_lib, dest_lib).expect("Failed to copy DLL file");
    fs::copy(src_dll, dest_dll).expect("Failed to copy DLL file");

    tauri_build::build()
}
