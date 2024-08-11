// EldenRemapperManualTesting.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include "json.hpp"
#include "src-cpp-elden-remapper.h"

int main()
{
    std::string hello = "mystring";
    auto dllResultStr = EldenOverrideCommand_Ext(hello.c_str());
    std::string dllResult(dllResultStr);
    EldenOverrideCommand_DeAllocString(dllResultStr);

    std::cout << "Response: " << dllResult;
}
