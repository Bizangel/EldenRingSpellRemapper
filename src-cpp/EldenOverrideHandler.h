#pragma once

#include "json.hpp"
#include "JoyMacroCore.h"
#include "EldenChordOverrider.h"

using json = nlohmann::json;

struct EldenOverrideCommandResponse {
	bool success;
	std::string payload;

	// Custom to_json function
	json to_json() {
		return nlohmann::json{ {"success", success}, {"payload", payload} };
	}

	// Custom from_json function
	//void from_json(const nlohmann::json& j, EldenOverrideCommandResponse& e) {
	//	j.at("success").get_to(e.success);
	//	j.at("payload").get_to(e.payload);
	//}
};

class EldenOverrideHandler
{
private: 
	static EldenOverrideHandler* _instance;
	static EldenOverrideHandler* EnsureResetInstance();

	int StartOverride_Internal();
	void StopOverride_Internal();

	JoyMacroOverrideClient* _overrideClient;
	EldenChordOverrider* _overrider;

	static EldenOverrideCommandResponse VerifyConfig(std::string config);
public:
	static int StartOverride();
	static void StopOverride();
	static bool IsOverrideActive();

	static std::string HandleCommand(std::string payload);
};

