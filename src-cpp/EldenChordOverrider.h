#pragma once

#include <iostream>
#include <algorithm>
#include "JoyMacroCore.h"
#include "EldenChordConfig.h"
#include "ButtonStringUtils.h"

#define ELDEN_DPAD_UP_RESET_MS 300

class EldenChordOverrider : public IGamepadOverrider
{
private:
    XINPUT_GAMEPAD prevInput;
    PaddleState prevPState;

    EldenRemapperConfig config;
    std::string modifier;
    std::vector<std::string> inputMappings;
    std::vector<std::pair<std::string, bool>> isButtonModlocked;

    int quickCastingIdx;

    int currentDpadCycleState;
    int currentSpellIdx;
    int nSpells;
    int desiredTargetSpell;
    int dpadCycleDelay;

    int cyclesRequiredToHoldReset;
    int currentResetCycle;

    void modlockButton(std::string button);
public:
    EldenChordOverrider(EldenRemapperConfig config);

    void OverrideInput(XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState) override;
};