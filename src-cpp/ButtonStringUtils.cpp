#include "ButtonStringUtils.h"

#define IS_PRESSED(gamepadref, button) (gamepadRef.wButtons & button) != 0
#define BUTTON_ACTIVATION_THRESHOLD 125

const std::vector<std::string> ButtonStringUtils::allButtons = { 
	"A", "B", "X", "Y", 
	"LB", "RB", "LT", "RT", 
	"START", "SELECT", 
	"DPAD_UP", "DPAD_LEFT", "DPAD_RIGHT", "DPAD_DOWN", 
	"LS", "RS", 
	"P1", "P2", "P3", "P4" 
};

const std::vector<std::string> ButtonStringUtils::quickCastButtons = {"LB", "RB"};

// Everything, except DPAD_UP and paddles.
const std::vector<std::string> ButtonStringUtils::outputMappings = { 
	"A", "B", "X", "Y",
	"LB", "RB", "LT", "RT",
	"START", "SELECT",
	"DPAD_LEFT", "DPAD_RIGHT", "DPAD_DOWN",
	"LS", "RS",
};

bool ButtonStringUtils::isValidButtonString(std::string button)
{
	return std::find(allButtons.begin(), allButtons.end(), button) != allButtons.end();
}

bool ButtonStringUtils::isValidQuickcastButton(std::string button)
{
	return std::find(quickCastButtons.begin(), quickCastButtons.end(), button) != quickCastButtons.end();
}

bool ButtonStringUtils::isValidOutputMapping(std::string button)
{
	return std::find(outputMappings.begin(), outputMappings.end(), button) != outputMappings.end();
}

bool ButtonStringUtils::isPressed(const std::string& button, const XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState)
{
	return buttonActuationLevel(button, gamepadRef, pState) >= BUTTON_ACTIVATION_THRESHOLD;
}


#define BUTTON_ACTUATION_LEVEL(button) (gamepadRef.wButtons & button) != 0 ? 255 : 0
#define PADDLE_ACTUATION_LEVEL(paddle) paddle ? 255 : 0

uint8_t ButtonStringUtils::buttonActuationLevel(const std::string& button, const XINPUT_GAMEPAD& gamepadRef, const PaddleState& pState)
{
	if (button == "A")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_A);
	else if (button == "B")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_B);
	else if (button == "X")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_X);
	else if (button == "Y")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_Y);
	else if (button == "LB")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_LEFT_SHOULDER);
	else if (button == "RB")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_RIGHT_SHOULDER);
	else if (button == "LT")
		return gamepadRef.bLeftTrigger;
	else if (button == "RT")
		return gamepadRef.bRightTrigger;
	else if (button == "START")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_START);
	else if (button == "SELECT")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_BACK);
	else if (button == "DPAD_UP")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_DPAD_UP);
	else if (button == "DPAD_DOWN")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_DPAD_DOWN);
	else if (button == "DPAD_LEFT")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_DPAD_LEFT);
	else if (button == "DPAD_RIGHT")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_DPAD_RIGHT);
	else if (button == "LS")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_LEFT_THUMB);
	else if (button == "RS")
		return BUTTON_ACTUATION_LEVEL(XINPUT_GAMEPAD_RIGHT_THUMB);
	else if (button == "P1")
		return PADDLE_ACTUATION_LEVEL(pState.P1);
	else if (button == "P2")
		return PADDLE_ACTUATION_LEVEL(pState.P2);
	else if (button == "P3")
		return PADDLE_ACTUATION_LEVEL(pState.P3);
	else if (button == "P4")
		return PADDLE_ACTUATION_LEVEL(pState.P4);

	return 0;
}

#define PRESS_BUTTON_CHECK(buttonStr, buttonMac) if (actuateButton && (button == buttonStr)) { gamepadRef.wButtons |= buttonMac; }
#define PRESS_BUTTON_CHECKELSEIF(buttonStr, buttonMac) else if (actuateButton && (button == buttonStr)) { gamepadRef.wButtons |= buttonMac; }
void ButtonStringUtils::pressButton(const std::string& button, XINPUT_GAMEPAD& gamepadRef, uint8_t actuationLevel)
{
	bool actuateButton = actuationLevel >= BUTTON_ACTIVATION_THRESHOLD;
	PRESS_BUTTON_CHECK("A", XINPUT_GAMEPAD_A)
	PRESS_BUTTON_CHECKELSEIF("B", XINPUT_GAMEPAD_B)
	PRESS_BUTTON_CHECKELSEIF("X", XINPUT_GAMEPAD_X)
	PRESS_BUTTON_CHECKELSEIF("Y", XINPUT_GAMEPAD_Y)
	PRESS_BUTTON_CHECKELSEIF("LB", XINPUT_GAMEPAD_LEFT_SHOULDER)
	PRESS_BUTTON_CHECKELSEIF("RB", XINPUT_GAMEPAD_RIGHT_SHOULDER)
	else if (button == "LT") { gamepadRef.bLeftTrigger = actuationLevel;  }
	else if (button == "RT") { gamepadRef.bRightTrigger = actuationLevel; }
	PRESS_BUTTON_CHECKELSEIF("START", XINPUT_GAMEPAD_START)
	PRESS_BUTTON_CHECKELSEIF("SELECT", XINPUT_GAMEPAD_BACK)
	PRESS_BUTTON_CHECKELSEIF("DPAD_UP", XINPUT_GAMEPAD_DPAD_UP)
	PRESS_BUTTON_CHECKELSEIF("DPAD_DOWN", XINPUT_GAMEPAD_DPAD_DOWN)
	PRESS_BUTTON_CHECKELSEIF("DPAD_LEFT", XINPUT_GAMEPAD_DPAD_LEFT)
	PRESS_BUTTON_CHECKELSEIF("DPAD_RIGHT", XINPUT_GAMEPAD_DPAD_RIGHT)
	PRESS_BUTTON_CHECKELSEIF("LS", XINPUT_GAMEPAD_LEFT_THUMB)
	PRESS_BUTTON_CHECKELSEIF("RS", XINPUT_GAMEPAD_RIGHT_THUMB)
}

#define RELEASE_BUTTON(button) gamepadRef.wButtons &= ~button
void ButtonStringUtils::releaseButton(const std::string& button, XINPUT_GAMEPAD& gamepadRef, PaddleState& pState)
{
	if (button == "A")
		RELEASE_BUTTON(XINPUT_GAMEPAD_A);
	else if (button == "B")
		RELEASE_BUTTON(XINPUT_GAMEPAD_B);
	else if (button == "X")
		RELEASE_BUTTON(XINPUT_GAMEPAD_X);
	else if (button == "Y")
		RELEASE_BUTTON(XINPUT_GAMEPAD_Y);
	else if (button == "LB")
		RELEASE_BUTTON(XINPUT_GAMEPAD_LEFT_SHOULDER);
	else if (button == "RB")
		RELEASE_BUTTON(XINPUT_GAMEPAD_RIGHT_SHOULDER);
	else if (button == "LT")
		gamepadRef.bLeftTrigger = 0;
	else if (button == "RT")
		gamepadRef.bRightTrigger = 0;
	else if (button == "START")
		RELEASE_BUTTON(XINPUT_GAMEPAD_START);
	else if (button == "SELECT")
		RELEASE_BUTTON(XINPUT_GAMEPAD_BACK);
	else if (button == "DPAD_UP")
		RELEASE_BUTTON(XINPUT_GAMEPAD_DPAD_UP);
	else if (button == "DPAD_DOWN")
		RELEASE_BUTTON(XINPUT_GAMEPAD_DPAD_DOWN);
	else if (button == "DPAD_LEFT")
		RELEASE_BUTTON(XINPUT_GAMEPAD_DPAD_LEFT);
	else if (button == "DPAD_RIGHT")
		RELEASE_BUTTON(XINPUT_GAMEPAD_DPAD_RIGHT);
	else if (button == "LS")
		RELEASE_BUTTON(XINPUT_GAMEPAD_LEFT_THUMB);
	else if (button == "RS")
		RELEASE_BUTTON(XINPUT_GAMEPAD_RIGHT_THUMB);
	else if (button == "P1")
		pState.P1 = false;
	else if (button == "P2")
		pState.P2 = false;
	else if (button == "P3")
		pState.P3 = false;
	else if (button == "P4")
		pState.P4 = false;
}
