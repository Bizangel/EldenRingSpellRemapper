import { useCallback, useEffect, useState } from "react";

type AllowedInputTypes = boolean | string
type SettingsInputEntryProps<T extends AllowedInputTypes> = {
    entryText: string,
    value: T
    onValidatedChange: (x: T) => void,
    validateInput: (x: T) => boolean // whether input is accepted or not,
    options?: React.InputHTMLAttributes<HTMLInputElement>
}

const SettingsInputEntry = <T extends AllowedInputTypes>(
    {value, validateInput, onValidatedChange, options, entryText}: SettingsInputEntryProps<T>
) => {
    const [internalInputState, setInternalInputState] = useState<T>(value);

    useEffect(() => {
        setInternalInputState(value)
    }, [value])

    const submitCheck = useCallback(() => {
        if (!validateInput(internalInputState)) {
            setInternalInputState(value) // put back to original
            return;
        }
        onValidatedChange(internalInputState)
    }, [internalInputState, value, setInternalInputState, onValidatedChange, validateInput])

    return (
        <div className="settings-entry">
            <p>{entryText}</p>
            <input
            className="settings-entry-box"
            checked={typeof internalInputState === "boolean" ? internalInputState : undefined}
            value={typeof internalInputState !== "boolean" ? internalInputState : undefined }
            onChange={(ev) => {
               typeof internalInputState !== "boolean"
               ? setInternalInputState(ev.target.value as T) :
               setInternalInputState(ev.target.checked as T)
            }}
            onBlur={() => { submitCheck(); }}
            onKeyUp={(ev) => {if (ev.key === 'Enter'){ev.currentTarget.blur()}}}
            {...options}
            />
        </div>
    )
}

export default SettingsInputEntry;