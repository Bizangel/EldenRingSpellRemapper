#pragma once

#include "json.hpp"
#include <string>
#include <vector>
#include <optional>

struct SpellMapping {
    std::string id;
    std::string spellName;
    
    // The Modifier + button to trigger the mapping. Can be any button.
    std::string buttonCombo; 
};

struct MiscConfig {
    int pollingDelay;
    bool automateHidHide;
    std::string quickCastButton;
    int spellswitchFrameDelay;
};

// Input Mappings are: Spell mappings, ModifierOutReplacement, ResetSpellMapping
// Output Mappings are: PaddleMappings, DpadUp Mapping.

// Input mappings can be anything. (All of them are modifier + something). But they cannot repeat the combo themselves.
// Output mappings cannot be DPAD_UP (overriding spell switching) 
// nor paddle mappings (as they're not present in the virtual controller)
// They CAN be shared if you want. (Player might want all paddles to map to B).
struct EldenRemapperConfig {
    MiscConfig miscConfig;
    std::vector<SpellMapping> spells;

    // Current button modifier. Can be any button
    std::string currentModifier;
    // Output mapping assigned to dpadup.
    std::string dpadUpMapping;
    std::string modifierOutReplacement;
    std::string resetSpellMapping;
    std::vector<std::string> paddleMapping;
};

struct ConfigCheckResponse {
    bool configOk;
    std::vector<std::string> errors;
};

struct EldenChordConfig_OLD {
    int POLLING_DELAY_MS = 8;
    int MODIFIER_ACTIVATION_THRESHOLD = 125;
    int CYCLE_DELAY_POLLS = 3;
    int RESET_POLLS_CYCLE = 30;
    int REMOVE_LOCK_THRESHOLD = 30;
    int quickCastButton = -1;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(SpellMapping, id, spellName, buttonCombo)
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(MiscConfig, pollingDelay, automateHidHide, quickCastButton, spellswitchFrameDelay)
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(EldenRemapperConfig, miscConfig, spells, currentModifier, dpadUpMapping, modifierOutReplacement, resetSpellMapping, paddleMapping)
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(ConfigCheckResponse, configOk, errors);