#include "ButtonStringUtils.h"


const std::vector<std::string> ButtonStringUtils::allButtons = { 
	"A", "B", "X", "Y", 
	"LB", "RB", "LT", "RT", 
	"START", "SELECT", 
	"DPAD_UP", "DPAD_LEFT", "DPAD_RIGHT", "DPAD_DOWN", 
	"LS", "RS", 
	"P1", "P2", "P3", "P4" 
};

const std::vector<std::string> ButtonStringUtils::quickCastButtons = {"LB", "RB"};

bool ButtonStringUtils::isValidButtonString(std::string button)
{
	return std::find(allButtons.begin(), allButtons.end(), button) != allButtons.end();
}

bool ButtonStringUtils::isValidQuickcastButton(std::string button)
{
	return std::find(quickCastButtons.begin(), quickCastButtons.end(), button) != quickCastButtons.end();
}
