import arrowBack from "./assets/arrow-left.svg"
import './AddSpellPage.scss'

type AddSpellPageProps = {
    goBackToSpellPage: () => void,
}


const SpellListEntry = ({spellid}: {spellid: string}) => {
    return (
        <div className="spell-list-entry">
            <img src={"/sample_spell.png"} className="responsive-image"/>
            <div className="spell-list-entry-text">
                {spellid}
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
                <SpellListEntry spellid="Glintstone stars"/>
                <SpellListEntry spellid="Glintstone moonlight"/>
                <SpellListEntry spellid="Frenzied Flame"/>
                <SpellListEntry spellid="Glintstone moonlight"/>
                <SpellListEntry spellid="Glintstone moonlight"/>
                <SpellListEntry spellid="Glintstone moonlight"/>
                <SpellListEntry spellid="Glintstone moonlight"/>
                <SpellListEntry spellid="Glintstone moonlight"/>
                <SpellListEntry spellid="Glintstone moonlight"/>
                <SpellListEntry spellid="Glintstone moonlight"/>
            </div>
        </div>
    )
}

export default AddSpellPage;