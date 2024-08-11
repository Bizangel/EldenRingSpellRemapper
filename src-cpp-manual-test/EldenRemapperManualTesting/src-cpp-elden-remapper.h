// The following ifdef block is the standard way of creating macros which make exporting
// from a DLL simpler. All files within this DLL are compiled with the SRCCPPELDENREMAPPER_EXPORTS
// symbol defined on the command line. This symbol should not be defined on any project
// that uses this DLL. This way any other project whose source files include this file see
// SRCCPPELDENREMAPPER_API functions as being imported from a DLL, whereas this DLL sees symbols
// defined with this macro as being exported.
#ifdef SRCCPPELDENREMAPPER_EXPORTS
#include "EldenOverrideHandler.h"
#include "JoyMacroCore.h"
#define SRCCPPELDENREMAPPER_API extern "C" __declspec(dllexport)
#else
#define SRCCPPELDENREMAPPER_API extern "C" __declspec(dllimport)
#endif

SRCCPPELDENREMAPPER_API int StopEldenOverride_Ext(void);
SRCCPPELDENREMAPPER_API bool IsEldenOverrideActive_Ext(void);
SRCCPPELDENREMAPPER_API const char* EldenOverrideCommand_Ext(const char* config);