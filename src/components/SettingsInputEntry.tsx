import { useCallback, useEffect, useState } from "react";

type SettingsInputEntryProps = {
    entryText: string,
    value: string
    onValidatedChange: (x: string) => void,
    validateInput: (x: string) => boolean // whether input is accepted or not,
    options?: React.InputHTMLAttributes<HTMLInputElement>
}

const SettingsInputEntry = (
    {value, validateInput, onValidatedChange, options, entryText}: SettingsInputEntryProps
) => {
    const [internalInputState, setInternalInputState] = useState<string>("");

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
            value={internalInputState}
            onChange={(ev) => {setInternalInputState(ev.target.value)}}
            onBlur={() => { submitCheck(); }}
            onKeyUp={(ev) => {if (ev.key === 'Enter'){ev.currentTarget.blur()}}}
            {...options}
            />
        </div>
    )
}

export default SettingsInputEntry;