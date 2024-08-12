// EldenRemapperManualTesting.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include "json.hpp"
#include "src-cpp-elden-remapper.h"

using json = nlohmann::json;

std::string SendEldenOverrideCommand(std::string& command) {
    auto dllResultStr = EldenOverrideCommand_Ext(command.c_str());
    std::string dllResult(dllResultStr);
    EldenOverrideCommand_DeAllocString(dllResultStr);
    return dllResult;
}

std::string SendEldenOverrideCommand(json command) {
    std::string tempStr = command.dump();
    auto dllResultStr = EldenOverrideCommand_Ext(tempStr.c_str());
    std::string dllResult(dllResultStr);
    EldenOverrideCommand_DeAllocString(dllResultStr);
    return dllResult;
}

int main()
{
    json spellMapping = json::array({
        {{"id", "spell1"}, {"spellName", "Spell 1"}, {"buttonCombo", "A"}},
        {{"id", "spell2"}, {"spellName", "Spell 2"}, {"buttonCombo", "B"}},
        {{"id", "spell3"}, {"spellName", "Spell 3"}, {"buttonCombo", "Y"}},
    });

    json config = {
      {"miscConfig", {
          {"pollingDelay", 10},
          {"automateHidHide", false},
          {"quickCastButton", ""},
          {"spellswitchFrameDelay", 4}
      }},
      {"spells", spellMapping},
      {"currentModifier", "LT"},
      {"dpadUpMapping", ""},
      {"modifierOutReplacement", ""},
      {"resetSpellMapping", "LS"},
      {"paddleMapping", {"", "", "", ""}}
    };
    
    std::string configStr = config.dump();

    json command = { {"command", "start-override"}, {"payload", configStr} };
    std::cout << "Start Override Response: " << SendEldenOverrideCommand(command);

    system("pause");

    command = { {"command", "stop-override"}, {"payload", ""}};
    std::cout << "Stop Override Response: " << SendEldenOverrideCommand(command);
}
