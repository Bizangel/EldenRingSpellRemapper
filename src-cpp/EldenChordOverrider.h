#pragma once

#include <iostream>
#include <algorithm>
#include "JoyMacroCore.h"
#include "EldenChordConfig.h"
#include "ButtonStringUtils.h"

class EldenChordOverrider : public IGamepadOverrider
{
private:
    EldenRemapperConfig config;
    std::string modifier;
    std::vector<std::string> inputMappings;

    std::vector<std::string> modifierLockedButtons;

    void removeModlock(std::string button);
    bool isbuttonModlocked(std::string button);
    void modlockButton(std::string button);
public:
    EldenChordOverrider(EldenRemapperConfig config);

    void OverrideInput(XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState) override;
};