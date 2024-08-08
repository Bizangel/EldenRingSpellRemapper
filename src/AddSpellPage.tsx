import arrowBack from "./assets/arrow-left.svg"
import './AddSpellPage.scss'
import Spells, { SpellType } from "./common/Spells.generated"
import { useCallback, useRef, useState } from "react"
import { useRemapper } from "./common/RemapConfig"

type AddSpellPageProps = {
    goBackToSpellPage: () => void,
}

const SpellListEntry = ({id, spellName, imageUrl}: SpellType) => {
    const addSpell = useRemapper(e => e.addSpell)
    const onEntryClick = useCallback(() => {
        addSpell(id)
    }, [addSpell])

    return (
        <div className="spell-list-entry" onClick={onEntryClick}>
            <div className="spell-list-entry-image">
            <img src={imageUrl} className="responsive-image"/>
            </div>
            <div className="spell-list-entry-text">
                {spellName}
            </div>
        </div>
    )
}

function filterByName(spells: SpellType[], filter: string) {
    let filterInternal = filter.toLocaleLowerCase().trim()
    return spells.filter(
        e => e.spellName.toLowerCase().includes(filterInternal),
    )
}

const PreviewSpellbar = () => {
    const spells = useRemapper(e => e.config.spells)
    const removeSpell = useRemapper(e => e.deleteSpell)
    const scrollPreviewRef = useRef<HTMLDivElement>(null)

    const onSpellClick = useCallback((spellId: string) => {
        removeSpell(spellId)
    }, [removeSpell])

    const onScroll = useCallback((ev: React.WheelEvent<HTMLDivElement>) => {
        if (scrollPreviewRef.current)
            scrollPreviewRef.current.scrollBy({top: 0, left: ev.deltaY, behavior: "instant"})
        }, [])

    return (
        <div className="spell-preview" onWheel={onScroll} ref={scrollPreviewRef}>
            {spells.map(spell =>
                <div key={spell.id} onClick={() => {onSpellClick(spell.id)}} className="spell-preview-card">
                    <div className="spell-preview-image">
                        <img src={`/spellsicons/${spell.id}.png`} className="responsive-image"></img>
                    </div>

                    <div className="spell-preview-text">
                        {spell.spellName}
                    </div>
                </div>
            )}
        </div>
    )
}

const AddSpellPage = ({goBackToSpellPage}: AddSpellPageProps) => {
    const [currentFilter, setCurrentFilter] = useState("");

    const onInputFilterChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentFilter(ev.target.value)
    }, [setCurrentFilter])

    return (
        <div className="addspell-page">
            <img src={arrowBack} className="back-icon" onClick={goBackToSpellPage}/>

            <input className="search-spell-box" value={currentFilter} onChange={onInputFilterChange}
            placeholder="Glintstone...">
            </input>

            <div className="spell-list">
                {filterByName(Spells, currentFilter).map(spell =>
                    <SpellListEntry key={spell.id} {...spell} />
                )}
            </div>

            <PreviewSpellbar/>
        </div>
    )
}

export default AddSpellPage;