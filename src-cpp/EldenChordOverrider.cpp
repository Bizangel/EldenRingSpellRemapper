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
}

#define PROCESS_PADDLE_MAPPING(paddleNumber) if (config.paddleMapping[##paddleNumber - 1] != "" && pState.P##paddleNumber) {ButtonStringUtils::pressButton(config.paddleMapping[##paddleNumber - 1], gamepadRef, 255); }

void EldenChordOverrider::OverrideInput(XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState)
{
	// Save unaltered input
	const XINPUT_GAMEPAD input(gamepadRef);

	bool modifierPressed = ButtonStringUtils::isPressed(modifier, input, pState);
	if (modifierPressed) {
		// unrelease all modifier buttons (input mappings)
		for (std::string& mapping : inputMappings) {
			ButtonStringUtils::releaseButton(mapping, gamepadRef);
		}
	}

	// Check for mappings see if one was pressed.
	if (modifierPressed) {
		// unrelease all modifier buttons (input mappings)
		for (int i = 0; i < config.spells.size(); i++) {
			auto& spell = config.spells[i];
			if (spell.buttonCombo != "" && ButtonStringUtils::isPressed(spell.buttonCombo, input, pState)) {
				std::cout << "setting target to spell: " << spell.spellName << " at index: " << i << std::endl;
				break;
			}
		}
	}

	// Process Outputs Mappings

	if (pState.P1)
		std::cout << "P1" << std::endl;

	if (pState.P2)
		std::cout << "P2" << std::endl;

	if (pState.P3)
		std::cout << "P3" << std::endl;

	if (pState.P4)
		std::cout << "P4" << std::endl;

	PROCESS_PADDLE_MAPPING(1)
	PROCESS_PADDLE_MAPPING(2)
	PROCESS_PADDLE_MAPPING(3)
	PROCESS_PADDLE_MAPPING(4)

	if (config.dpadUpMapping != "" && ButtonStringUtils::isPressed("DPAD_UP", input, pState))
		ButtonStringUtils::pressButton(config.dpadUpMapping, gamepadRef, 255);
}