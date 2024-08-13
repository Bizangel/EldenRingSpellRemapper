import fs from "fs"

const dllFileName = "elden-remapper.dll"
const executableFileName = "elden-ring-spell-remapper.exe"
// ensure folder exists
if (!fs.existsSync("./out"))
    fs.mkdirSync("./out")

fs.copyFileSync(`./src-tauri/target/release/${dllFileName}`, `./out/${dllFileName}`)
fs.copyFileSync(`./src-tauri/target/release/${executableFileName}`, `./out/${executableFileName}`)