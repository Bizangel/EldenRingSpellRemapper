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
    std::cout << "I received a string C++: " << payload << std::endl;
    std::string returnstring("Hello from C++");

    // Allocate memory for the string on the heap and return a pointer to it
    char* result = new char[returnstring.size() + 1];
    strncpy_s(result, returnstring.size() + 1, returnstring.c_str(), returnstring.size());
    return result;
}

