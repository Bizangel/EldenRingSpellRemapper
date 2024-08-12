#pragma once

#include "json.hpp"
#include "JoyMacroCore.h"
#include "ButtonStringUtils.h"
#include <sstream>
#include "EldenChordOverrider.h"

using json = nlohmann::json;

struct EldenOverrideCommandResponse {
	bool success;
	std::string payload;
};

struct EldenOverrideCommandPayload {
	std::string command;
	std::string payload;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(EldenOverrideCommandResponse, success, payload)
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(EldenOverrideCommandPayload, command, payload)

// Helper concat function
// Base case for handling a single value
template <typename T>
std::string concat(const T& val) {
	std::stringstream msg;
	msg << val;
	return msg.str();
}

// Recursive case for handling multiple parameters
template <typename T, typename... Args>
std::string concat(const T& first, const Args&... args) {
	std::stringstream msg;
	msg << first;
	return msg.str() + concat(args...);
}



class EldenOverrideHandler
{
private: 
	static EldenOverrideHandler* _instance;
	static void EnsureResetInstance();

	int StartOverride_Internal(EldenRemapperConfig config);
	void StopOverride_Internal();

	JoyMacroOverrideClient* _overrideClient;
	EldenChordOverrider* _overrider;

	static ConfigCheckResponse VerifyConfig(EldenRemapperConfig config);
	static int StartOverride(EldenRemapperConfig config);
public:
	static void StopOverride();
	static bool IsOverrideActive();

	static std::string HandleCommand(std::string payload);
};

