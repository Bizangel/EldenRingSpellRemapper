#pragma once

#include <iostream>
#include "JoyMacroCore.h"
#include "EldenChordConfig.h"
#include "ButtonStringUtils.h"

class EldenChordOverrider : public IGamepadOverrider
{
private:
    EldenRemapperConfig config;
    std::string modifier;
    std::vector<std::string> inputMappings;
public:
    EldenChordOverrider(EldenRemapperConfig config);

    void OverrideInput(XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState) override;
};