#include "EldenChordOverrider.h"


bool isPressed(const WORD& buttonsState, const int& compareAgainst)
{
	return ((buttonsState & compareAgainst) != 0);
}

EldenChordOverrider::EldenChordOverrider(EldenChordConfig_OLD misc,
	int boundedChordsC, int* boundedButtonsArr,
	int* boundedSpellIdxArr, int nSpellsCount)
{
	currentSpell = 0;
	currentTargetSpell = 0;
	equippedSpellCount = nSpells;
	LockRTFromModifier = false;
	dpadCycler = 0;
	ModifierButtonsLock = false;
	lastCombinationButtonPressed = 0;
	chordConfig = misc;

	nSpells = nSpellsCount;
	boundedChordsCount = boundedChordsC; // How many spells are bounded
	boundedButtons = boundedButtonsArr; // Array of Bounded buttons
	boundedSpellIndex = boundedSpellIdxArr; // Array of bounded spell indexes

	ZeroMemory(&prevInput, sizeof(XINPUT_STATE));
	ZeroMemory(&prevOutput, sizeof(XINPUT_STATE));
}

void EldenChordOverrider::OverrideInput(XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState)
{
	// Save unaltered input
	const XINPUT_GAMEPAD input(gamepadRef);

	/*
	* ============
	TRIGGER LOGIC
	==============
	*/

	// Detect Trigger Inputs
	bool isModifier = gamepadRef.bLeftTrigger >= chordConfig.MODIFIER_ACTIVATION_THRESHOLD;
	gamepadRef.bLeftTrigger = 0;

	if (input.bRightTrigger > chordConfig.MODIFIER_ACTIVATION_THRESHOLD && prevInput.bRightTrigger <= chordConfig.MODIFIER_ACTIVATION_THRESHOLD) // When RT is pressed
		if (input.bLeftTrigger >= chordConfig.MODIFIER_ACTIVATION_THRESHOLD)
			LockRT = true; // request a repress

	if (input.bRightTrigger < 30) // LockRT is request an RT Repress.
		LockRT = false;

	if (isModifier) {
		// turn right analog into left.
		gamepadRef.bLeftTrigger = input.bRightTrigger;
		gamepadRef.bRightTrigger = 0;
		LockRT = true;
	}

	if (LockRT)
		gamepadRef.bRightTrigger = 0;


	/*
	* ========================
	HOTKEYS ACTIVATION LOGIC
	==========================
	* Do not modify triggers here!
	*/

	if (isModifier)
		ModifierButtonsLock = true;

	if (input.bLeftTrigger < chordConfig.REMOVE_LOCK_THRESHOLD && !isPressed(input.wButtons, lastCombinationButtonPressed))
		ModifierButtonsLock = false;

	if (isModifier) {
		for (int i = 0; i < boundedChordsCount; i++) {
			bool isCurrentlyPressed = isPressed(input.wButtons, boundedButtons[i]);
			bool wasPressed = isPressed(prevInput.wButtons, boundedButtons[i]);
			if (isCurrentlyPressed && !wasPressed) {
				// queue the specified spell

				currentTargetSpell = boundedSpellIndex[i];

				if (currentTargetSpell == currentSpell)
					quickCast = true;

				lastCombinationButtonPressed = boundedButtons[i];
			}

			if (wasPressed && !isCurrentlyPressed) {
				quickCast = false; // release
			}
		}
	}

	if (ModifierButtonsLock) // cancel that input.
		gamepadRef.wButtons &= ~lastCombinationButtonPressed;

	// Ensure verification that target spell is within bounds. Else will have infinite loop
	if (currentTargetSpell >= nSpells || currentTargetSpell < 0)
		currentTargetSpell = 0; // just simply default to 0

	// Perform DPAD Logic, a cycler will be ticked on every poll, keeping track of previous states.
	if (!(dpadCycler == 0 && currentSpell == currentTargetSpell)) {// don't tick cycler

		if (dpadCycler == 0) // start to cycle
		{
			currentSpell++;
			currentSpell %= nSpells;
			gamepadRef.wButtons |= XINPUT_GAMEPAD_DPAD_UP; // set dpad up
		}
		else if (dpadCycler <= chordConfig.CYCLE_DELAY_POLLS - 1) { // hold button
			gamepadRef.wButtons |= XINPUT_GAMEPAD_DPAD_UP;
		}
		else if (dpadCycler <= (chordConfig.CYCLE_DELAY_POLLS * 2 - 1)) { // release
			gamepadRef.wButtons &= ~XINPUT_GAMEPAD_DPAD_UP;
		}

		dpadCycler++;

		if (dpadCycler == chordConfig.CYCLE_DELAY_POLLS * 2 - 1)
			dpadCycler = 0;
	}

	// Implement reset mechanic, if user holds dpadup, then spell will reset back to default (including logically in the program)
	if (isPressed(prevOutput.wButtons, XINPUT_GAMEPAD_DPAD_UP))
		holderDetector++;
	else
		holderDetector = 0;

	if (holderDetector == chordConfig.RESET_POLLS_CYCLE) {
		currentSpell = 0;
		currentTargetSpell = 0;
	}


	if (quickCast && chordConfig.quickCastButton != -1) {
		gamepadRef.wButtons |= chordConfig.quickCastButton;
	}

	prevInput = input;
	prevOutput = gamepadRef;
}