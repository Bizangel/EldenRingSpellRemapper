import { create } from "zustand";
import { produce } from 'immer'
import { ButtonString } from "./Buttons";
import { createJSONStorage, persist } from "zustand/middleware";
import Spells from "./Spells.generated";

export type SpellMapping = {
    id: string;
    spellName: string;
    buttonCombo?: ButtonString;
}

const MAX_SPELL_AMOUNT = 14

// contains all application global state
export type EldenRingRemapperConfig = {
    miscConfig: {
        pollingDelay: number,
        automateHidHide: boolean
        quickCastButton?: ButtonString,
        spellswitchFrameDelay: number,
    },
    spells : SpellMapping[],
    currentModifier: ButtonString,
    dpadUpMapping?: ButtonString,
    modifierOutReplacement?: ButtonString,
    paddleMapping: (ButtonString | undefined)[]
}

export type EldenRingRemapperStore = {
    config: EldenRingRemapperConfig,

    reorderSpell: (spellId1: string, spellId2: string) => void,
    deleteSpell: (spellId: string) => void,
    remapSpell: (spellId: string, mapping?: ButtonString) => void,
    addSpell: (spellId: string) => void,

    setModifier: (button: ButtonString) => void,
    setPaddleMapping: (paddle: number, button?: ButtonString) => void,
    setReplacementModifierMapping: (button?: ButtonString) => void,
    setDpadUpMapping: (button?: ButtonString) => void,

    setPollDelay: (newDelay: number) => void
    setAutomateHidHide: (option: boolean) => void,
    setQuickcastButton: (buttonString?: ButtonString) => void,

    setSwitchFrameDelay: (newDelay: number) => void
}

export const useRemapper = create<EldenRingRemapperStore>()(
    persist(
        (set, get) => ({
        config: {
            paddleMapping: [undefined, undefined, undefined, undefined],
            miscConfig: {
                pollingDelay: 10,
                automateHidHide: false,
                spellswitchFrameDelay: 3,
                quickCastButton: undefined,
            },
            spells: [],
            currentModifier: "LT",
            modifierOutReplacement: undefined,
            dpadUpMapping: undefined,
        },

        reorderSpell: (spell1, spell2) => {
            set(
                produce((state: EldenRingRemapperStore) => {
                    const i = state.config.spells.findIndex(e => e.id === spell1);
                    const j = state.config.spells.findIndex(e => e.id === spell2);
                    if (i != j && i > -1 && j > -1)
                        [state.config.spells[i], state.config.spells[j]] = [state.config.spells[j], state.config.spells[i]];
                })
            )
        },

        remapSpell: (spell, button) => {
            set(
                produce ((state: EldenRingRemapperStore) => {
                    const i = state.config.spells.findIndex(e => e.id === spell);
                    if (i > -1 && button != get().config.currentModifier)
                        state.config.spells[i].buttonCombo = button
                })
            )
        },

        deleteSpell : (spell) => {
            set(
                produce ((state: EldenRingRemapperStore) => {
                    const i = state.config.spells.findIndex(e => e.id === spell);
                    if (i > -1)
                        state.config.spells.splice(i, 1)
                })
            )
        },

        addSpell : (spell) => {
            set(
                produce ((state: EldenRingRemapperStore) => {
                    // don't add more than maximum
                    if (get().config.spells.length >= MAX_SPELL_AMOUNT)
                        return;

                    // ensure spell is not present already
                    if (get().config.spells.findIndex(e => e.id === spell) !== -1)
                        return

                    const spellIdx = Spells.findIndex(e => e.id === spell)
                    if (spellIdx === -1)
                        return

                    const spellName = Spells[spellIdx].spellName
                    state.config.spells.push({id: spell, spellName: spellName, buttonCombo: undefined})
                })
            )
        },

        setModifier: (button) => {
            set(
                produce ((state: EldenRingRemapperStore) => {
                    state.config.currentModifier = button
                })
            )
        },

        setPaddleMapping: (paddle, button) => {
            if (paddle < 0 || paddle > 3)
                return;

            if (button !== undefined && ["P1", "P2", "P3", "P4"].includes(button))
                return;

            set(
                produce((state: EldenRingRemapperStore) => {
                state.config.paddleMapping[paddle] = button
                })
            )
        },

        setReplacementModifierMapping: (button) => {
            set(
                produce((state: EldenRingRemapperStore) => {
                    state.config.modifierOutReplacement = button
                })
            )
        },

        setDpadUpMapping: (button) => {
            set(
                produce((state: EldenRingRemapperStore) => {
                    state.config.dpadUpMapping = button
                })
            )
        },

        setPollDelay: (newDelay) => {
            set(
                produce((state: EldenRingRemapperStore) => {
                    state.config.miscConfig.pollingDelay = newDelay
                })
            )
        },

        setAutomateHidHide: (option) => {
            set(
                produce((state: EldenRingRemapperStore) => {
                    state.config.miscConfig.automateHidHide = option
                })
            )
        },

        setQuickcastButton: (button) => {
            set(
                produce((state: EldenRingRemapperStore) => {
                    if (button === "LB" || button === "RB" || button === undefined )
                        state.config.miscConfig.quickCastButton = button
                })
            )
        },

        setSwitchFrameDelay: (newDelay) => {
            set(
                produce((state: EldenRingRemapperStore) => {
                    state.config.miscConfig.spellswitchFrameDelay = newDelay
                })
            )
        }
    }),
    {
        name: 'debug-storage22',
        storage: createJSONStorage(() => localStorage)
    }
    )
)


