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
        {{"id", "glintstone_stars"}, {"spellName", "Glintstone Stars"}, {"buttonCombo", "LB"}},
        {{"id", "glintstone_pebble"}, {"spellName", "Glintstone Stars"}, {"buttonCombo", "LB"}},
        {{"id", "moonlight"}, {"spellName", "Glintstone Stars"}, {"buttonCombo", "M3"}},
    });

    json config = {
      {"miscConfig", {
          {"pollingDelay", -1},
          {"automateHidHide", false},
          {"quickCastButton", "LB"},
          {"spellswitchFrameDelay", 100}
      }},
      {"spells", spellMapping},
      {"currentModifier", "M3"},
      {"dpadUpMapping", "M"},
      {"modifierOutReplacement", "RT"},
      {"resetSpellMapping", "M3"},
      {"paddleMapping", {"", "M3", "P1", "DPAD_UP"}}
    };

    
    std::string configStr = config.dump();
    //std::cout << "config payload " << configStr << std::endl;
    json command = { {"command", "check-config"}, {"payload", configStr} };
    std::cout << "Response: " << SendEldenOverrideCommand(command);
}
