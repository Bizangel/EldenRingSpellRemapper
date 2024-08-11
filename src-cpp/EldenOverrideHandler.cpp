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
		
		// Commands
		if (payload.command == "check-config") {
			auto configJson = json::parse(payload.payload);
			auto config = configJson.template get<EldenRemapperConfig>();
			return json(VerifyConfig(config)).dump();
		}
		
		return json(EldenOverrideCommandResponse{ false, "Unrecognized Command" }).dump();
	}
	catch (json::parse_error& ex)
	{
		std::cerr << "parse json error" << ex.byte << std::endl;
		return json(EldenOverrideCommandResponse{ false, "Malformed Config Given" }).dump();
	}
}

EldenOverrideCommandResponse EldenOverrideHandler::VerifyConfig(EldenRemapperConfig config)
{
	return EldenOverrideCommandResponse{ true, "good config" };
}
