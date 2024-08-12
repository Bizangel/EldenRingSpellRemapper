#pragma once

#include <string>
#include <vector>
#include <algorithm>
#include "JoyMacroCore.h"

class ButtonStringUtils
{
public:
	static const std::vector<std::string> allButtons;
	static const std::vector<std::string> quickCastButtons;
	static const std::vector<std::string> outputMappings;

	static bool isValidButtonString(std::string buttonString);
	static bool isValidQuickcastButton(std::string buttonString);
	static bool isValidOutputMapping(std::string buttonString);

	static bool isPressed(const std::string& button, const XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState);
	static uint8_t buttonActuationLevel(const std::string& button, const XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState);

	static void pressButton(const std::string& button, XINPUT_GAMEPAD& gamepadRef, uint8_t actuationLevel);
	static void releaseButton(const std::string& button, XINPUT_GAMEPAD& gamepadRef);
};

