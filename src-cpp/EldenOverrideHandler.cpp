#include "EldenOverrideHandler.h"

EldenOverrideHandler* EldenOverrideHandler::_instance = nullptr;

EldenOverrideHandler* EldenOverrideHandler::EnsureResetInstance()
{
	if (EldenOverrideHandler::_instance != nullptr) {
		// if calling start for some reason, cleanup first
		EldenOverrideHandler::_instance->StopOverride_Internal();
		delete _instance;
	}

	return new EldenOverrideHandler();
}

int EldenOverrideHandler::StartOverride_Internal()
{
	//_overrider = new EldenChordOverrider()
	//_overrideClient = new JoyMacroOverrideClient();
	//_overrideClient->StartOverride(_overrider);
	// remember to check exit code. if non zero no need to close, cleanup properly
	return 0;
}

void EldenOverrideHandler::StopOverride_Internal()
{
	//_overrideClient->StopOverride();
	//delete _overrideClient;
	//_overrideClient = nullptr;

	//delete _overrider;
}

int EldenOverrideHandler::StartOverride()
{
	std::cout << "Start Override C++ " << std::endl;
	// Ensure every config here is available.

	EldenOverrideHandler* handler = EnsureResetInstance(); // ensure instance is fresh.
	return handler->StartOverride_Internal();
}

void EldenOverrideHandler::StopOverride()
{
	std::cout << "Stop Override C++" << std::endl;
	EldenOverrideHandler* handler = EldenOverrideHandler::_instance;
	if (handler == nullptr) // nothing to stop
		return;

	// cleanup
	handler->StopOverride_Internal();
	delete handler;
	handler = nullptr;
}

bool EldenOverrideHandler::IsOverrideActive()
{
	if (EldenOverrideHandler::_instance == nullptr) // nothing to stop
		return false;

	return true;
}

std::string EldenOverrideHandler::HandleCommand(std::string payload)
{
	try
	{
		auto parsedJson = json::parse(payload);
		auto payload = parsedJson.template get<EldenOverrideCommandPayload>();
		
		// Commands
		if (payload.command == "check-config") {
			auto configJson = json::parse(payload.payload);
			auto config = configJson.template get<EldenRemapperConfig>();
			auto configCheckResponse = VerifyConfig(config);
			return json(EldenOverrideCommandResponse{ true, json(configCheckResponse).dump() }).dump();
		}
		
		return json(EldenOverrideCommandResponse{ false, "Unrecognized Command" }).dump();
	}
	catch (json::parse_error& ex)
	{
		std::cerr << "parse json error" << ex.byte << std::endl;
		return json(EldenOverrideCommandResponse{ false, "Malformed Config Given" }).dump();
	}
}

ConfigCheckResponse EldenOverrideHandler::VerifyConfig(EldenRemapperConfig config)
{
	std::vector<std::string> errors;
	// 1. Test MiscConfig values
	if (config.miscConfig.pollingDelay < 1)
		errors.push_back(concat("Polling delay cannot be less than 1, found: ", config.miscConfig.pollingDelay));

	if (!ButtonStringUtils::isValidQuickcastButton(config.miscConfig.quickCastButton) )
		errors.push_back(concat("Invalid Quick cast Button found: ", config.miscConfig.quickCastButton, " must be LB or RB"));

	if (config.miscConfig.spellswitchFrameDelay < 1 || config.miscConfig.spellswitchFrameDelay > 10)
		errors.push_back(concat("Invalid Spell Switch Frame Delay, must be within 1 and 10, found: ", config.miscConfig.spellswitchFrameDelay));

	// 2. Test everything related to spells.
	// 2.1. Test no duplicate spell ids
	for (size_t i = 0; i < config.spells.size(); ++i) {
		for (size_t j = i + 1; j < config.spells.size(); ++j) {
			if (config.spells[i].id == config.spells[j].id) {
				errors.push_back(concat("Duplicate Spell ID found: ", config.spells[i].id));
			}
		}
	}

	// 2.2. Test all spell buttons are valid.
	for (size_t i = 0; i < config.spells.size(); ++i) {
		if (!ButtonStringUtils::isValidButtonString(config.spells[i].buttonCombo)) {
			errors.push_back(concat("Spell " , config.spells[i].spellName, " has invalid button: ", config.spells[i].buttonCombo));
		}
	}

	// 3. Test other mappings are okay (currentModifier)
	if (!ButtonStringUtils::isValidButtonString(config.currentModifier))
		errors.push_back(concat("Invalid Modifier Button: ", config.currentModifier));

	if (!ButtonStringUtils::isValidButtonString(config.currentModifier))
		errors.push_back(concat("Invalid Modifier Button: ", config.currentModifier));
	
	// TODO: Make a distinction between input mappings and Output mappings.
	// Input mappings can be whatever. While output mappings cannot be DPAD_UP nor any paddle.
	
	return ConfigCheckResponse{ errors.size() == 0, errors };
}