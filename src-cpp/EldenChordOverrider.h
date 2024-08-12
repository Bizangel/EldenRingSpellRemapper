#pragma once

#include <iostream>
#include <algorithm>
#include "JoyMacroCore.h"
#include "EldenChordConfig.h"
#include "ButtonStringUtils.h"

class EldenChordOverrider : public IGamepadOverrider
{
private:
    XINPUT_GAMEPAD prevInput;
    PaddleState prevPState;

    EldenRemapperConfig config;
    std::string modifier;
    std::vector<std::string> inputMappings;

    std::vector<std::pair<std::string, bool>> isButtonModlocked;

    void modlockButton(std::string button);
public:
    EldenChordOverrider(EldenRemapperConfig config);

    void OverrideInput(XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState) override;
};