#include "EldenChordOverrider.h"

void EldenChordOverrider::removeModlock(std::string button)
{
	modifierLockedButtons.erase(std::remove(modifierLockedButtons.begin(), modifierLockedButtons.end(), button), modifierLockedButtons.end());
}

bool EldenChordOverrider::isbuttonModlocked(std::string button)
{
	return std::find(modifierLockedButtons.begin(), modifierLockedButtons.end(), button) != modifierLockedButtons.end();
}

void EldenChordOverrider::modlockButton(std::string button)
{
	if (!isbuttonModlocked(button))
		modifierLockedButtons.push_back(button);	
}

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

	ButtonStringUtils::releaseButton(modifier, gamepadRef); // modifier by default input shouldn't be processed.
	ButtonStringUtils::releaseButton("DPAD_UP", gamepadRef); // DPAD_UP by default shouldn't be enabled. Let cycler logic below handle it.
	uint8_t modifierActuationLevel = ButtonStringUtils::buttonActuationLevel(modifier, input, pState);
	bool modifierPressed = ButtonStringUtils::isPressed(modifier, input, pState);
	if (modifierPressed) {
		// unrelease all modifier buttons (input mappings)
		for (std::string& mapping : inputMappings) {
			ButtonStringUtils::releaseButton(mapping, gamepadRef);
			// modifier lock them, to avoid accidental presses after releasing modifier
			modlockButton(mapping);
		}
	}

	// Prevent modlocked buttons from reporting
	if (!modifierPressed) {
		// check each modlocked mapping to remove
		std::vector<std::string> itercopy(modifierLockedButtons);
		for (std::string& mapping : itercopy) {
			if (!ButtonStringUtils::isPressed(mapping, input, pState)) {
				removeModlock(mapping);
			}
		}

		// unpress those still locked
		for (std::string& mapping : modifierLockedButtons) {
			ButtonStringUtils::releaseButton(mapping, gamepadRef);
		}
	}


	// Check for mappings see if one was pressed.
	if (modifierPressed) {
		for (int i = 0; i < config.spells.size(); i++) {
			auto& spell = config.spells[i];
			if (spell.buttonCombo != "" && ButtonStringUtils::isPressed(spell.buttonCombo, input, pState)) {
				std::cout << "setting target to spell: " << spell.spellName << " at index: " << i << std::endl;
				break;
			}
		}
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
}