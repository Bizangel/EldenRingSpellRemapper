#pragma once

#include "json.hpp"
#include <string>
#include <vector>
#include <optional>

struct SpellMapping {
    std::string id;
    std::string spellName;
    std::string buttonCombo;
};

struct MiscConfig {
    int pollingDelay;
    bool automateHidHide;
    std::string quickCastButton;
    int spellswitchFrameDelay;
};

struct EldenRemapperConfig {
    MiscConfig miscConfig;
    std::vector<SpellMapping> spells;
    std::string currentModifier;
    std::string dpadUpMapping;
    std::string modifierOutReplacement;
    std::string resetSpellMapping;
    std::vector<std::string> paddleMapping;
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