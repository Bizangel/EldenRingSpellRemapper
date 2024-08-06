import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  async function startOverride() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    await invoke("start_elden_override", { });
  }

  async function stopOverride() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    await invoke("stop_elden_override", { });
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more. </p>

      <button onClick={startOverride}>
        Start Override
      </button>

      <button onClick={stopOverride}>
        Stop Override
      </button>
    </div>
  );
}

export default App;
