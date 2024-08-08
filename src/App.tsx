import { useCallback, useState } from "react";
import "./App.scss";
import SpellMapPage from "./SpellMapPage";
import SettingsPage from "./SettingsPage";
import AddSpellPage from "./AddSpellPage";

function App() {
  const [activePage, setActivePage] = useState("spell");
  const goToSettingsPage = useCallback(() => {setActivePage("settings")}, [setActivePage]);
  const goToAddSpellPage = useCallback(() => {setActivePage("addspell")}, [setActivePage]);
  const goBackToSpellPage = useCallback(() => {setActivePage("spell")}, [setActivePage]);

  return (
    <>
      {activePage === "spell" && <SpellMapPage {...{goToSettingsPage, goToAddSpellPage}}/>}
      {activePage === "settings" && <SettingsPage {...{goBackToSpellPage}}/>}
      {activePage === "addspell" && <AddSpellPage {...{goBackToSpellPage}}/>}
    </>
  );
}

export default App;
