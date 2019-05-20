import {h} from 'preact'

import Aggregation from './Aggregation.js'
import ContextHeader from './ContextHeader.js'

import makeAggregateFunction from '../finance/makeAggregateFunction.js'
import {AggregationDescriptionToJSON} from '../finance/AggregationDataStructures.js'
import {ASYNC_STATUS, STATUS_VALUE, STATUS_ERROR} from '../asyncStatusHelpers.js';
import _actions from '../actions'

function mapStateToProps({aggregationDescription, testedDocumentBudgetaireWithPlanDeCompte = {}, documentBudgetairesWithPlanDeCompte, millerColumnSelection}){
    const {documentBudgetaire, planDeCompte} = testedDocumentBudgetaireWithPlanDeCompte;

    return {
        aggregationDescription,
        selectedList: millerColumnSelection,
        aggregatedDocumentBudgetaire: aggregationDescription && 
            documentBudgetaire && documentBudgetaire[ASYNC_STATUS] === STATUS_VALUE &&
            planDeCompte && planDeCompte[ASYNC_STATUS] === STATUS_VALUE ?
                makeAggregateFunction(aggregationDescription, planDeCompte)(documentBudgetaire) :
                undefined,
        documentBudgetairesWithPlanDeCompte: documentBudgetairesWithPlanDeCompte.filter(
            ({documentBudgetaire, planDeCompte}) => 
                documentBudgetaire && documentBudgetaire[ASYNC_STATUS] === STATUS_VALUE &&
                planDeCompte && planDeCompte[ASYNC_STATUS] === STATUS_VALUE
        )
    }
}

export default function({store}){
    const actions =_actions(store);

    const {testedDocumentBudgetaireWithPlanDeCompte = {}, aggregationDescription} = store.state;
    const {documentBudgetaire} = testedDocumentBudgetaireWithPlanDeCompte;
    const docBudg = documentBudgetaire && documentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ? 
        documentBudgetaire : 
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

                const date = new Date();

                const a = document.createElement('a');
                a.style.position = "absolute"; // getting off document flow
                // making an effort to hide the element as much as possible
                a.style.zIndex = -1;
                a.style.opacity = 0;
                
                a.setAttribute('href', blobUrl);
                a.setAttribute('download', 
                    `description-agrégation-${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}.json`
                );
                document.body.appendChild(a)
                a.click();
                document.body.removeChild(a);
            }
        },
        mapStateToProps(store.state),
        actions
    )

    const errors = store.state.documentBudgetairesWithPlanDeCompte
        .filter(({planDeCompte}) => planDeCompte && planDeCompte[ASYNC_STATUS] === STATUS_ERROR)
        .map(({documentBudgetaire: {Nomenclature, Exer}, planDeCompte}) => {
            return `Le plan de compte pour la nomenclature ${Nomenclature}, année ${Exer} n'a pas pu être récupéré (${planDeCompte.url}, "${planDeCompte.message}")`
        })

    return html`
        <main>
            <${ContextHeader} documentBudgetaire=${docBudg} onNewDocumentBudgetaireText=${actions.onNewDocumentBudgetaireText} errors=${errors}/> 
            <${Aggregation} ...${props}/>
        </main>
    `
}