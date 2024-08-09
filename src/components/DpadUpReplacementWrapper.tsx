import { useCallback } from 'react';
import { useRemapper } from '../common/RemapConfig';
import right from "../assets/chevron-right.svg"
import { useButtonPickerContextMenu } from './ButtonPickerContextMenu';
import { ButtonList, ButtonToImage } from '../common/Buttons';

const DpadUpReplacementWrapper = () => {
    const showButtonContext = useButtonPickerContextMenu()
    const currentDpadMapping = useRemapper(e => e.config.dpadUpMapping);
    const setDpadUpMapping = useRemapper(e => e.setDpadUpMapping);

    const openContextMenu = useCallback((ev: React.MouseEvent) => {
        showButtonContext(ev.clientX, ev.clientY,
            ButtonList.filter(e => !["P1","P2","P3","P4", "DPAD_UP"].includes(e)),
            setDpadUpMapping,
            currentDpadMapping,
            {openUpwards: true} // open upwards
        );

        ev.preventDefault()
    }, [showButtonContext])

    return (
        <div className="modifier-replacement-wrapper">
                <img src={`/buttonicons/XboxOne_Dpad_Up.png`} className="responsive-image"></img>

                <img src={right} className="responsive-image" style={{filter: "invert(1)"}}></img>

                <div className="modifier-mapping-switcheable-wrapper"
                onClick={openContextMenu} onContextMenu={openContextMenu}>
                    { currentDpadMapping &&
                        <img src={`/buttonicons/XboxOne_${ButtonToImage[currentDpadMapping]}.png`}
                        className="responsive-image-w"/>
                    }
                </div>
        </div>
    )
}

export default DpadUpReplacementWrapper