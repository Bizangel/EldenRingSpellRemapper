#pragma once

#include <string>
#include <vector>
#include <algorithm>



class ButtonStringUtils
{
public:
	static const std::vector<std::string> allButtons;
	static const std::vector<std::string> quickCastButtons;
	static const std::vector<std::string> outputMappings;

	static bool isValidButtonString(std::string buttonString);
	static bool isValidQuickcastButton(std::string buttonString);
	static bool isValidOutputMapping(std::string buttonString);
};

