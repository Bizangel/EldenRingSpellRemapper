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
	std::cout << "received payload: " << payload << std::endl;
		
	try
	{
		auto parsedJson = json::parse(payload);
		auto payload = parsedJson.template get<EldenOverrideCommandPayload>();

		std::cout << "parsed command: " << payload.command << std::endl;
		std::cout << "parsed payload: " << payload.payload << std::endl;

		// try parsing config

		auto configJson = json::parse(payload.payload);
		std::cout << "parsed json!" << std::endl;
		auto config = configJson.template get<EldenRemapperConfig>();


		std::cout << "parsed config\n"; 
		std::cout << "modifier: " << config.currentModifier << std::endl;
		std::cout << "dpadUpMapping: " << config.dpadUpMapping << std::endl;
		std::cout << "miscConfig: " << json(config.miscConfig).dump() << std::endl;
		std::cout << "modifier replacement: " << config.modifierOutReplacement << std::endl;
		std::cout << "paddle mapping: " << json(config.paddleMapping).dump() << std::endl;
		std::cout << "paddle spells mapping: " << json(config.spells).dump() << std::endl;

		return json(EldenOverrideCommandResponse{ true, "Able to parse!" }).dump();
	}
	catch (json::parse_error& ex)
	{
		std::cerr << "parse json error" << ex.byte << std::endl;
		return json(EldenOverrideCommandResponse{ false, "Malformed Config Given" }).dump();
	}
}

EldenOverrideCommandResponse EldenOverrideHandler::VerifyConfig(std::string config)
{
	return EldenOverrideCommandResponse{ true, "good config" };
}
