import { useCallback } from 'react'
import './PaddleMapper.scss'
import right from "./assets/chevron-right.svg"
import { ButtonToImage } from './common/Buttons';
import { usePaddleMapperContextMenu } from './PaddleMapperContextMenu';
import { useRemapper } from './common/RemapConfig';

const PaddleMappingPair = ({paddleNumber}: {paddleNumber: number}) => {
    const paddleMapping = useRemapper(e => e.config.paddleMapping);
    const currentMapping = paddleMapping[paddleNumber];

    const showContextMenu = usePaddleMapperContextMenu(e => e.showContextMenu);
    const openContextMenu = useCallback((ev: React.MouseEvent) => {
        showContextMenu(ev.pageX, ev.pageY, paddleNumber);
        ev.preventDefault();
    }, [showContextMenu, paddleNumber])

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