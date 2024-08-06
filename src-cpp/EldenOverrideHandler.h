#pragma once

#include "JoyMacroCore.h"
#include "EldenChordOverrider.h"

class EldenOverrideHandler
{
private: 
	static EldenOverrideHandler* _instance;
	static EldenOverrideHandler* EnsureResetInstance();

	int StartOverride_Internal();
	void StopOverride_Internal();

	JoyMacroOverrideClient* _overrideClient;
	EldenChordOverrider* _overrider;
public:
	static int StartOverride();
	static void StopOverride();


};

