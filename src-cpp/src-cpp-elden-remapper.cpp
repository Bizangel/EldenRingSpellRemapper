// src-cpp-elden-remapper.cpp : Defines the exported functions for the DLL.
//

#include "framework.h"
#include "src-cpp-elden-remapper.h"
#include <string>

// This is an example of an exported function.
SRCCPPELDENREMAPPER_API int StopEldenOverride_Ext(void)
{
    EldenOverrideHandler::StopOverride();
    return 0;
}

SRCCPPELDENREMAPPER_API bool IsEldenOverrideActive_Ext(void)
{
    return EldenOverrideHandler::IsOverrideActive();
}

SRCCPPELDENREMAPPER_API const char* EldenOverrideCommand_Ext(const char* payload)
{
    std::string info(payload);        
    std::string returnString = EldenOverrideHandler::HandleCommand(info);

    // Allocate memory for the string on the heap and return a pointer to it
    char* result = new char[returnString.size() + 1];
    strncpy_s(result, returnString.size() + 1, returnString.c_str(), returnString.size());
    return result;
}

