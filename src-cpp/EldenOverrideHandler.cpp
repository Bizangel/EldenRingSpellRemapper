#include "EldenOverrideHandler.h"

EldenOverrideHandler* EldenOverrideHandler::_instance = nullptr;

void EldenOverrideHandler::EnsureResetInstance()
{
	if (EldenOverrideHandler::_instance != nullptr) {
		// if calling start for some reason, cleanup first
		EldenOverrideHandler::_instance->StopOverride_Internal();
		delete _instance;
	}

	auto _instance = new EldenOverrideHandler();
	EldenOverrideHandler::_instance = _instance;
}

int EldenOverrideHandler::StartOverride_Internal(EldenRemapperConfig config)
{
	_overrider = new EldenChordOverrider(config);
	_overrideClient = new JoyMacroOverrideClient();
	int overrideIndex = _overrideClient->getFirstActiveControllerIndex();

	if (!config.miscConfig.automateHidHide)
		_overrideClient->disableHidHide();

	_overrideClient->setPollingDelayMs(config.miscConfig.pollingDelay);

	// TODO: Add this to the UI to avoid hardcoded keys mapping. For now use these keys on whatever paddle->key mapping software you use. 
	// ref: in US keyboard, in order: P1: single double quotes key, P2: colon/semicolon key, P3: rightbrace/rightbracket key, P4: plus/equal key
	std::vector<int> paddleKeymapping { 222, 192, 187, 221 };
	int overrideCode = _overrideClient->StartOverride(overrideIndex, _overrider, paddleKeymapping);
	return overrideCode;
}

void EldenOverrideHandler::StopOverride_Internal()
{
	_overrideClient->StopOverride();
	delete _overrideClient;
	_overrideClient = nullptr;
	delete _overrider;
	_overrider = nullptr;
}

int EldenOverrideHandler::StartOverride(EldenRemapperConfig config)
{
	std::cout << "Start Override C++ " << std::endl;
	EnsureResetInstance(); // ensure instance is fresh.
	EldenOverrideHandler* handler = EldenOverrideHandler::_instance;
	int overrideCode = handler->StartOverride_Internal(config);
	if (overrideCode != 0) {
		// cleanup everything
		delete handler->_overrider;
		delete handler->_overrideClient;
		delete _instance;
		_instance = nullptr;
	}

	return overrideCode;
}

void EldenOverrideHandler::StopOverride()
{
	std::cout << "Stop Override C++" << std::endl;
	EldenOverrideHandler* _instance = EldenOverrideHandler::_instance;
	if (_instance == nullptr) // nothing to stop
		return;

	// cleanup
	_instance->StopOverride_Internal();
	delete _instance;
	_instance = nullptr;
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

		if (payload.command == "start-override") {
			auto configJson = json::parse(payload.payload);
			auto config = configJson.template get<EldenRemapperConfig>();
			auto configCheckResponse = VerifyConfig(config);
			if (!configCheckResponse.configOk)
				return json(EldenOverrideCommandResponse{ false, "Invalid Override Config given" }).dump();

			int overrideCode = StartOverride(config);
			switch (overrideCode) {
				case JoyMacroExitCode::SUCCESS:
					return json(EldenOverrideCommandResponse{ true, "Successfully started override!" }).dump();
				case JoyMacroExitCode::ALREADY_INITIALIZED:
					return json(EldenOverrideCommandResponse{ false, "Override already initialized!" }).dump();
				case JoyMacroExitCode::VIGEM_UNABLE_INITIALIZE:
					return json(EldenOverrideCommandResponse{ false, "Unable to initialize VigemBusDriver! Is Vigem Installed?" }).dump();
				case JoyMacroExitCode::VIGEM_UNABLE_PLUG_CONTROLLER:
					return json(EldenOverrideCommandResponse{ false, "Unable to instantiate VigemBusDriver controller" }).dump();
				case JoyMacroExitCode::HID_HIDE_MISSING:
					return json(EldenOverrideCommandResponse{ false, "Unable to find HidHide, has HidHide been installed?" }).dump();
				default:
					return json(EldenOverrideCommandResponse{ false, "Unable to start override" }).dump();
			}
		}

		if (payload.command == "stop-override") {
			StopOverride();
			return json(EldenOverrideCommandResponse{ true, "Override Stop Requested" }).dump();
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

	if (config.miscConfig.quickCastButton != "" && !ButtonStringUtils::isValidQuickcastButton(config.miscConfig.quickCastButton))
		errors.push_back(concat("Invalid Quick cast Button found: ", config.miscConfig.quickCastButton, " must be LB or RB"));

	if (config.miscConfig.spellswitchFrameDelay < 1 || config.miscConfig.spellswitchFrameDelay > 100)
		errors.push_back(concat("Invalid Spell Switch Frame Delay, must be within 1 and 100, found: ", config.miscConfig.spellswitchFrameDelay));

	// 2. Test everything related to spells.
	// 2.1. Test no duplicate spell ids
	for (size_t i = 0; i < config.spells.size(); ++i) {
		for (size_t j = i + 1; j < config.spells.size(); ++j) {
			if (config.spells[i].id == config.spells[j].id) {
				errors.push_back(concat("Duplicate Spell ID found: ", config.spells[i].id));
			}
		}
	}

	// 2.2. Test all spell buttons are valid. (Input Mappings)
	for (size_t i = 0; i < config.spells.size(); ++i) {
		if (config.spells[i].buttonCombo != "" && !ButtonStringUtils::isValidButtonString(config.spells[i].buttonCombo)) {
			errors.push_back(concat("Spell " , config.spells[i].spellName, " has invalid button: ", config.spells[i].buttonCombo));
		}
	}

	// 3. Test other mappings are okay (currentModifier)
	// Input Mappings
	if (!ButtonStringUtils::isValidButtonString(config.currentModifier))
		errors.push_back(concat("Invalid Modifier Button: ", config.currentModifier));

	if (config.modifierOutReplacement != "" && !ButtonStringUtils::isValidButtonString(config.modifierOutReplacement))
		errors.push_back(concat("Invalid Modifier Replacement Mapping: ", config.modifierOutReplacement));

	if (!ButtonStringUtils::isValidButtonString(config.resetSpellMapping))
		errors.push_back(concat("Invalid Reset Spell Mapping: ", config.resetSpellMapping));

	// Output Mappings
	if (config.dpadUpMapping != "" && !ButtonStringUtils::isValidOutputMapping(config.dpadUpMapping))
		errors.push_back(concat("Invalid Dpad Up (Output) Mapping: ", config.dpadUpMapping, " Must be regular Xbox Controller buttons excluding DPAD_UP and paddles."));

	for (int i = 0; i < config.paddleMapping.size(); i++) {
		if (config.paddleMapping[i] != "" && !ButtonStringUtils::isValidOutputMapping(config.paddleMapping[i]))
			errors.push_back(concat("Invalid Paddle ", i + 1,  " (Output) Mapping: ", config.paddleMapping[i], " Must be regular Xbox Controller buttons excluding DPAD_UP and paddles."));
	}

	if (config.paddleMapping.size() != 4)
		errors.push_back(concat("Found paddle mappings of different size other than 4"));

	// Create all input mappings together. 
	std::vector<std::pair<std::string, std::string>> inputsMappings;
	for (int i = 0; i < config.spells.size(); i++) {
		inputsMappings.push_back({ config.spells[i].spellName, config.spells[i].buttonCombo });
	}
	inputsMappings.push_back({ "Modifier Replacement Mapping", config.modifierOutReplacement });
	inputsMappings.push_back({ "Reset Spell Mapping", config.resetSpellMapping });

	// 4. Check no input mappings contain modifier.
	for (size_t i = 0; i < inputsMappings.size(); ++i) {
		auto& map = inputsMappings[i];
		if (map.second != "" && map.second == config.currentModifier)
			errors.push_back(concat(map.first, " has an invalid modifier (Double Modifier)"));
	}

	// 5. Check no Input mappings contain same mapping.
	for (size_t i = 0; i < inputsMappings.size(); ++i) {
		for (size_t j = i + 1; j < inputsMappings.size(); ++j) {
			auto& mapA = inputsMappings[i];
			auto& mapB = inputsMappings[j];

			if (mapA.second == "" || mapB.second == "") // ignore empty mappings. no conflict there.
				continue;

			if (mapA.second == mapB.second)
				errors.push_back(concat(mapA.first, " and ", mapB.first, " share the same input mapping."));
		}
	}
	
	return ConfigCheckResponse{ errors.size() == 0, errors };
}