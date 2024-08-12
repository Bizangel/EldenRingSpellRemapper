import { useCallback, useEffect } from 'react'
import './ConfigErrorDisplay.scss'
import OverrideAPI from '../common/OverrideAPI'
import { useRemapper } from '../common/RemapConfig'

const ConfigErrorDisplay = () => {
    const configChange = useRemapper(e => e.config);
    const configErrors = useRemapper(e => e.currentConfigErrors);
    const setCurrentConfigErrors = useRemapper(e => e.setCurrentConfigErrors);

    const checkOverrideConfigAsync = useCallback(async () => {
        const checkResponse = await OverrideAPI.checkOverrideConfig();
        setCurrentConfigErrors(checkResponse.errors);
    }, [setCurrentConfigErrors])

    useEffect(() => {
        checkOverrideConfigAsync();
    }, [checkOverrideConfigAsync, configChange]) // everytime config changes

    return (
        <div className="issues-box-wrapper">
            {configErrors.length > 0 &&
                <div className="issues-box">
                    <h1> Error{configErrors.length > 1 ? "s" : ""} </h1>
                    {configErrors.map((e, idx) =>
                        <p key={idx}>- {e} </p>
                    )}
                </div>
            }
        </div>
    )
}

export default ConfigErrorDisplay;