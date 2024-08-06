#pragma once

#include <iostream>
#include "JoyMacroCore.h"
#include "EldenChordConfig.h"

class EldenChordOverrider : public IGamepadOverrider
{
private:
    XINPUT_GAMEPAD prevInput;
    XINPUT_GAMEPAD prevOutput;

    EldenChordConfig chordConfig;

    int nSpells; // amount of spells currently equipped
    int boundedChordsCount; // How many spells are bounded
    int* boundedButtons; // Array of Bounded buttons
    int* boundedSpellIndex; // Array of bounded spell indexes
    // boundedButtons[i] is the button that maps to the boundedSpellIndex[i]

    bool quickCast; // whether quickcast hotkey should be pressed

    short currentSpell;
    short equippedSpellCount;
    short dpadCycler;
    short holderDetector;

    int currentTargetSpell; // Spell we're trying to get to.

    bool LockRTFromModifier; // used to prevent conjunction from modifier
    bool LockRT;


    int lastCombinationButtonPressed; // last combination button pressed

    bool ModifierButtonsLock; // locks buttons with modifiers to be pressed until modifier is fully release
public:
    EldenChordOverrider(EldenChordConfig misc,
        int boundedChordsC, int* boundedButtonsArr,
        int* boundedSpellIdxArr, int nSpells);

    void OverrideInput(XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState) override;
};