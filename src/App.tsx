import { useCallback, useState } from "react";
import "./App.scss";
import SpellMapPage from "./pages/SpellMapPage";
import SettingsPage from "./pages/SettingsPage";
import AddSpellPage from "./pages/AddSpellPage";
import ButtonPickerContextMenu from "./components/ButtonPickerContextMenu";

function App() {
  const [activePage, setActivePage] = useState("spell");
  const goToSettingsPage = useCallback(() => {setActivePage("settings")}, [setActivePage]);
  const goToAddSpellPage = useCallback(() => {setActivePage("addspell")}, [setActivePage]);
  const goBackToSpellPage = useCallback(() => {setActivePage("spell")}, [setActivePage]);

  return (
    <>
      <ButtonPickerContextMenu />
      {activePage === "spell" && <SpellMapPage {...{goToSettingsPage, goToAddSpellPage}}/>}
      {activePage === "settings" && <SettingsPage {...{goBackToSpellPage}}/>}
      {activePage === "addspell" && <AddSpellPage {...{goBackToSpellPage}}/>}
    </>
  );
}

export default App;
