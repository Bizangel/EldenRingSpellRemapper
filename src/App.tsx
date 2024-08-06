import { useCallback, useState } from "react";
import "./App.scss";
import SpellMapPage from "./SpellMapPage";
import SettingsPage from "./SettingsPage";

function App() {
  const [settingsPageActive, setSettingsPageActive] = useState(false);
  const goToSettingsPage = useCallback(() => {setSettingsPageActive(true)}, [setSettingsPageActive]);
  const goBackToSpellPage = useCallback(() => {setSettingsPageActive(false)}, [setSettingsPageActive]);

  return (
    <>
      {!settingsPageActive && <SpellMapPage {...{goToSettingsPage}}/>}
      {settingsPageActive && <SettingsPage {...{goBackToSpellPage}}/>}
    </>
  );
}

export default App;
