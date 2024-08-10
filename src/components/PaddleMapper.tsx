import { useCallback } from 'react'
import './PaddleMapper.scss'
import { ButtonList, ButtonString } from '../common/Buttons';
import { useRemapper } from '../common/RemapConfig';
import { ButtonMappingPair } from './ButtonMappingPair';

const PaddleMappingPair = ({paddleNumber}: {paddleNumber: number}) => {
    const currentMapping = useRemapper(e => e.config.paddleMapping[paddleNumber]);
    const setPaddleMapping = useRemapper(e => e.setPaddleMapping);

    const onPaddleSwitch = useCallback((button?: ButtonString) => {
        setPaddleMapping(paddleNumber, button);
    }, [setPaddleMapping, paddleNumber])

    return (
        <ButtonMappingPair
            mappingSource={`P${paddleNumber + 1}` as ButtonString}
            buttons={ButtonList.filter(e => !["P1","P2","P3","P4", "DPAD_UP"].includes(e))}
            value={currentMapping}
            onValueChange={onPaddleSwitch}
        />
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