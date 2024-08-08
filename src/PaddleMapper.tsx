import { useState } from 'react'
import './PaddleMapper.scss'
import right from "./assets/chevron-right.svg"


const PaddleMappingSelect = () => {
    const [opened, setOpened] = useState(false);

    if (!opened)
        return (
            <div className="paddle-mapping-select" onClick={() => {setOpened(true)}}>

            </div>
        )

    return (
        <div className="paddle-mapping-select-wrapper">
            {
                !opened && <div className="paddle-mapping-select" onClick={() => {setOpened(true)}}/>
            }

            {
                opened &&
                <div className="paddle-mapping-select-opened">
                    <img src="/buttonicons/XboxOne_A.png"></img>
                    <img src="/buttonicons/XboxOne_X.png"></img>
                    <img src="/buttonicons/XboxOne_Y.png"></img>
                    <img src="/buttonicons/XboxOne_B.png"></img>
                </div>
            }

        </div>

    )
}

const PaddleMapper = () => {
    return (
        <div className="paddle-mapping-wrapper">
            <div className="paddle-column">
                <div className="paddle-mapping">
                    <img src="/buttonicons/XboxOne_P1.png"></img>
                    <img src={right}/>
                    <PaddleMappingSelect/>
                </div>
                <div className="paddle-mapping">
                    <img src="/buttonicons/XboxOne_P2.png"></img>
                    <img src={right}/>


                </div>
            </div>
            <div className="paddle-column">

            </div>
        </div>
    )
}

export default PaddleMapper;