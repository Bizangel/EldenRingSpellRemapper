import arrowBack from "./assets/arrow-left.svg"
import './AddSpellPage.scss'
import Spells, { SpellType } from "./common/Spells.generated"

type AddSpellPageProps = {
    goBackToSpellPage: () => void,
}


const SpellListEntry = ({spellName, imageUrl}: SpellType) => {
    return (
        <div className="spell-list-entry">
            <div className="spell-list-entry-image">
            <img src={imageUrl} className="responsive-image"/>
            </div>
            <div className="spell-list-entry-text">
                {spellName}
            </div>
        </div>
    )
}

const AddSpellPage = ({goBackToSpellPage}: AddSpellPageProps) => {
    return (
        <div className="addspell-page">
            <img src={arrowBack} className="back-icon" onClick={goBackToSpellPage}/>

            <input className="search-spell-box">
            </input>

            <div className="spell-list">
                {Spells.map(spell =>
                    <SpellListEntry key={spell.id} {...spell}/>
                )}
            </div>
        </div>
    )
}

export default AddSpellPage;