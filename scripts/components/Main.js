import {Set as ImmutableSet} from 'immutable'
import {h} from 'preact'

import Aggregation from './Aggregation.js'
import ContextHeader from './ContextHeader.js'

import makeAggregateFunction from '../finance/makeAggregateFunction.js'
import {ASYNC_STATUS, STATUS_VALUE} from '../asyncStatusHelpers.js';
import _actions from '../actions'

function mapStateToProps({aggregationDescription, testedDocumentBudgetaire, millerColumnSelection}){
    return {
        aggregationDescription,
        selectedList: millerColumnSelection,
        aggregatedDocumentBudgetaire: aggregationDescription && testedDocumentBudgetaire && testedDocumentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ?
            makeAggregateFunction(aggregationDescription)(testedDocumentBudgetaire) :
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
        { // disambiguation with props with the 'aggregationDescription'
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