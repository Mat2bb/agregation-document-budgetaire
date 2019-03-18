import {Set as ImmutableSet} from 'immutable'
import preact from 'preact'

import makeLigneBudgetFilterFromFormula from '../DocumentBudgetaireQueryLanguage/makeLigneBudgetFilterFromFormula.js'
import Agregation from './Agregation.js'

const {h} = preact;

function mapDispatchToProps(store){
    return {
        addFormula({name, formula}){
            store.mutations.addFormula({name, formula})
        }
    }
}

function mapStateToProps({formulas, testedDocumentBudgetaire}){
    return {
        agregation: formulas.map(({name, formula}) => (
            {
                name, 
                formula, 
                rows: testedDocumentBudgetaire ?
                    testedDocumentBudgetaire.rows.slice(0, 40).filter(makeLigneBudgetFilterFromFormula(formula)) :
                    new ImmutableSet()
            }
        )),
        documentBudgetaire: testedDocumentBudgetaire
    }
}

export default function({store}){
    const props = Object.assign(
        mapStateToProps(store.state),
        mapDispatchToProps(store)
    )

    return html`
        <div>
            <h1>Yo !</h1>
            <${Agregation} ...${props}/>
        </div>
        
    `
}