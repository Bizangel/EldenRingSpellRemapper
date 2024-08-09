import { useCallback } from 'react'
import './PaddleMapper.scss'
import right from "../assets/chevron-right.svg"
import { ButtonList, ButtonString, ButtonToImage } from '../common/Buttons';
import { useRemapper } from '../common/RemapConfig';
import { useButtonPickerContextMenu } from './ButtonPickerContextMenu';

const PaddleMappingPair = ({paddleNumber}: {paddleNumber: number}) => {
    const showButtonContext = useButtonPickerContextMenu()
    const currentMapping = useRemapper(e => e.config.paddleMapping[paddleNumber]);
    const setPaddleMapping = useRemapper(e => e.setPaddleMapping);

    const onPaddleSwitch = useCallback((button?: ButtonString) => {
        setPaddleMapping(paddleNumber, button);
    }, [currentMapping, paddleNumber])

    const openContextMenu = useCallback((ev: React.MouseEvent) => {
        showButtonContext(ev.clientX, ev.clientY,
            ButtonList.filter(e => !["P1","P2","P3","P4"].includes(e)),
            onPaddleSwitch,
            currentMapping,
            true // open upwards
        );

        ev.preventDefault()
    }, [showButtonContext])

    return (
        <div className="paddle-mapping-pair">
            <div className="paddle-mapping-pair-imagewrap">
                <img src={`/buttonicons/XboxOne_P${paddleNumber + 1}.png`} className="responsive-image-w"></img>
            </div>
            <div className="paddle-mapping-pair-imagewrap arrow">
                <img src={right} className="responsive-image-w"></img>
            </div>
            <div className="paddle-mapping-pair-imagewrap switcheable"
            onClick={openContextMenu} onContextMenu={openContextMenu}>
                { currentMapping &&
                    <img src={`/buttonicons/XboxOne_${ButtonToImage[currentMapping]}.png`} className="responsive-image-w"></img>
                }
            </div>
        </div>
    )
}

const PaddleMapper = () => {
    return (
        <div className="paddle-mapping-wrapper">
            <div className="paddle-column">
                <PaddleMappingPair paddleNumber={0}/>
                <PaddleMappingPair paddleNumber={1}/>
            </div>
            <div className="paddle-column">
                <PaddleMappingPair paddleNumber={2}/>
                <PaddleMappingPair paddleNumber={3}/>
            </div>
        </div>
    )
}

export default PaddleMapper;