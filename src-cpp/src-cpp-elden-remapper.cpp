// src-cpp-elden-remapper.cpp : Defines the exported functions for the DLL.
//

#include "framework.h"
#include "src-cpp-elden-remapper.h"

// This is an example of an exported function.
SRCCPPELDENREMAPPER_API int StartEldenOverride_Ext(void)
{
    return EldenOverrideHandler::StartOverride();
}

SRCCPPELDENREMAPPER_API int StopEldenOverride_Ext(void)
{
    EldenOverrideHandler::StopOverride();
    return 0;
}

