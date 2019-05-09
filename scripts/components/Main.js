import {h} from 'preact'

import Aggregation from './Aggregation.js'
import ContextHeader from './ContextHeader.js'

import makeAggregateFunction from '../finance/makeAggregateFunction.js'
import {AggregationDescriptionToJSON} from '../finance/AggregationDataStructures.js'
import {ASYNC_STATUS, STATUS_VALUE} from '../asyncStatusHelpers.js';
import _actions from '../actions'

function mapStateToProps({aggregationDescription, testedDocumentBudgetaire, millerColumnSelection}){
    return {
        aggregationDescription,
        selectedList: millerColumnSelection,
        aggregatedDocumentBudgetaire: aggregationDescription && testedDocumentBudgetaire && testedDocumentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ?
            makeAggregateFunction(aggregationDescription)(testedDocumentBudgetaire) :
            undefined,
        documentBudgetaire: testedDocumentBudgetaire && testedDocumentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ?
            testedDocumentBudgetaire :
            undefined
    }
}

export default function({store}){
    const actions =_actions(store);

    const {testedDocumentBudgetaire, aggregationDescription} = store.state;
    const docBudg = testedDocumentBudgetaire && testedDocumentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ? 
        testedDocumentBudgetaire : 
        undefined

    const props = Object.assign(
        {},
        store.mutations,
        { // disambiguation with props with the 'aggregationDescription'
            aggregationDescriptionMutations: store.mutations.aggregationDescription,
            triggerAggregationDescriptionDownload: () => {
                const content = JSON.stringify(AggregationDescriptionToJSON(aggregationDescription), null, 2)

                const blob = new Blob([content], {type: 'application/json'});
                const blobUrl = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.style.position = "absolute"; // getting off document flow
                // making an effort to hide the element as much as possible
                a.style.zIndex = -1;
                a.style.opacity = 0;
                
                a.setAttribute('href', blobUrl);
                a.setAttribute('download', 'description-agrégation.json');
                document.body.appendChild(a)
                a.click();
                document.body.removeChild(a);
            }
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