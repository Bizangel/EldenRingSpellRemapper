#pragma once

#include "json.hpp"
#include "JoyMacroCore.h"
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

class EldenOverrideHandler
{
private: 
	static EldenOverrideHandler* _instance;
	static EldenOverrideHandler* EnsureResetInstance();

	int StartOverride_Internal();
	void StopOverride_Internal();

	JoyMacroOverrideClient* _overrideClient;
	EldenChordOverrider* _overrider;

	static EldenOverrideCommandResponse VerifyConfig(EldenRemapperConfig config);
public:
	static int StartOverride();
	static void StopOverride();
	static bool IsOverrideActive();

	static std::string HandleCommand(std::string payload);
};

