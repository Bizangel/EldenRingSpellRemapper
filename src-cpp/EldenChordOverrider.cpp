#include "EldenChordOverrider.h"

EldenChordOverrider::EldenChordOverrider(EldenRemapperConfig config) : config(config)
{
	modifier = config.currentModifier;
	// Create input mappings
	inputMappings.clear();
	for (int i = 0; i < config.spells.size(); i++) {
		// some spells might be unbound, just ignore them for now.
		if (config.spells[i].buttonCombo != "")
			inputMappings.push_back(config.spells[i].buttonCombo);
	}

	// modifier replacement can be null
	if (config.modifierOutReplacement != "")
		inputMappings.push_back(config.modifierOutReplacement);
	// this one cannot be null
	inputMappings.push_back(config.resetSpellMapping);

	// Create isButtonModifierLocked
	isButtonModlocked.clear();
	for (auto& button : ButtonStringUtils::allButtons)
		isButtonModlocked.push_back({ button, false });

	// Init help variables
	currentSpellIdx = 0;
	nSpells = config.spells.size();
	currentDpadCycleState = 0;
	desiredTargetSpell = 0;
	dpadCycleDelay = config.miscConfig.spellswitchFrameDelay;
}

void EldenChordOverrider::modlockButton(std::string button)
{
	for (int i = 0; i < isButtonModlocked.size(); i++) {
		if (isButtonModlocked[i].first == button) {
			isButtonModlocked[i].second = true;
			break;
		}
	}
}

#define PROCESS_PADDLE_MAPPING(paddleNumber) if (config.paddleMapping[##paddleNumber - 1] != "" && pState.P##paddleNumber) {ButtonStringUtils::pressButton(config.paddleMapping[##paddleNumber - 1], gamepadRef, 255); }

void EldenChordOverrider::OverrideInput(XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState)
{
	// Save unaltered input
	const XINPUT_GAMEPAD input(gamepadRef);

	ButtonStringUtils::releaseButton(modifier, gamepadRef); // modifier by default input shouldn't be processed.
	ButtonStringUtils::releaseButton("DPAD_UP", gamepadRef); // DPAD_UP by default shouldn't be enabled. Let cycler logic below handle it.
	uint8_t modifierActuationLevel = ButtonStringUtils::buttonActuationLevel(modifier, input, pState);
	bool modifierPressed = ButtonStringUtils::isPressed(modifier, input, pState);
	if (modifierPressed) {
		// unrelease all modifier buttons (input mappings)
		for (std::string& mapping : inputMappings) {
			ButtonStringUtils::releaseButton(mapping, gamepadRef);
			// modifier lock them, to avoid accidental presses after releasing modifier
			if (ButtonStringUtils::isPressed(mapping, input, pState))
				modlockButton(mapping);
		}
	}

	// Modlock logic
	if (!modifierPressed) {
		for (auto& mapping : isButtonModlocked) {
			if (!mapping.second) // not modlocked
				continue;

			if (!ButtonStringUtils::isPressed(mapping.first, input, pState))
				mapping.second = false; // remove modlock if released

			// unpress those still locked
			if (mapping.second)
				ButtonStringUtils::releaseButton(mapping.first, gamepadRef);
		}
	}

	// Check for mappings see if one was pressed.
	if (modifierPressed) {
		for (int i = 0; i < config.spells.size(); i++) {
			auto& spell = config.spells[i];
			if (spell.buttonCombo == "")
				continue;

			bool isCurrentlyPressed = ButtonStringUtils::isPressed(spell.buttonCombo, input, pState);
			bool wasPressed = ButtonStringUtils::isPressed(spell.buttonCombo, prevInput, prevPState);

			if (isCurrentlyPressed && !wasPressed) {
				std::cout << "setting target to spell: " << spell.spellName << " at index: " << i << std::endl;
				desiredTargetSpell = i;
;			}
		}
	}

	// ==== Dpad cycling logic. =====
	if (!(currentDpadCycleState == 0 && currentSpellIdx == desiredTargetSpell)) { // don't tick cycler
		if (currentDpadCycleState == 0) // start to cycle
		{
			currentSpellIdx++;
			currentSpellIdx %= nSpells;
			gamepadRef.wButtons |= XINPUT_GAMEPAD_DPAD_UP; // set dpad up
		}
		else if (currentDpadCycleState <= dpadCycleDelay - 1) { // hold button
			gamepadRef.wButtons |= XINPUT_GAMEPAD_DPAD_UP;
		}
		else if (currentDpadCycleState <= (dpadCycleDelay * 2 - 1)) { // release
			gamepadRef.wButtons &= ~XINPUT_GAMEPAD_DPAD_UP;
		}

		currentDpadCycleState++;

		if (currentDpadCycleState == dpadCycleDelay * 2 - 1)
			currentDpadCycleState = 0;
	}

	// Process Outputs Mappings
	PROCESS_PADDLE_MAPPING(1)
	PROCESS_PADDLE_MAPPING(2)
	PROCESS_PADDLE_MAPPING(3)
	PROCESS_PADDLE_MAPPING(4)

	if (config.dpadUpMapping != "" && ButtonStringUtils::isPressed("DPAD_UP", input, pState))
		ButtonStringUtils::pressButton(config.dpadUpMapping, gamepadRef, 255);

	// Process modifier output
	if (modifierPressed && config.modifierOutReplacement != "") {
		auto replacementActuation = ButtonStringUtils::buttonActuationLevel(config.modifierOutReplacement, input, pState);
		ButtonStringUtils::pressButton(modifier, gamepadRef, replacementActuation);
	}

	prevInput = input;
	prevPState = pState;
}