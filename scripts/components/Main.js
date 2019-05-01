import {Set as ImmutableSet} from 'immutable'
import {h} from 'preact'

import Aggregation from './Aggregation.js'
import ContextHeader from './ContextHeader.js'

import makeLigneBudgetFilterFromFormula from '../DocumentBudgetaireQueryLanguage/makeLigneBudgetFilterFromFormula.js'
import {ASYNC_STATUS, STATUS_VALUE} from '../asyncStatusHelpers.js';
import _actions from '../actions'

function mapStateToProps({aggregationDescription, testedDocumentBudgetaire, millerColumnSelection}){
    return {
        aggregationDescription,
        selectedList: millerColumnSelection,
        /*aggregation: [...formulas.values()].map(({id, name, formula}) => (
            {
                id,
                name, 
                formula, 
                rows: testedDocumentBudgetaire && testedDocumentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ?
                    testedDocumentBudgetaire.rows.filter(makeLigneBudgetFilterFromFormula(formula)) :
                    new ImmutableSet()
            }
        )),*/
        documentBudgetaire: testedDocumentBudgetaire && testedDocumentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ? 
            testedDocumentBudgetaire : 
            undefined
    }
}

export default function({store}){
    const actions =_actions(store);

    const {testedDocumentBudgetaire} = store.state;
    const docBudg = testedDocumentBudgetaire && testedDocumentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ? 
        testedDocumentBudgetaire : 
        undefined

    const props = Object.assign(
        {},
        store.mutations,
        { // disambiguation with props with the same name
            aggregationDescriptionMutations: store.mutations.aggregationDescription
        },
        mapStateToProps(store.state),
        actions
    )

    return html`
        <main>
            <${ContextHeader} documentBudgetaire=${docBudg} onNewDocumentBudgetaireText=${actions.onNewDocumentBudgetaireText} /> 
            <${Aggregation} ...${props}/>
        </main>
    `
}