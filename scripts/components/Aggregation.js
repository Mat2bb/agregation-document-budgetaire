import {h} from 'preact'

import AggregationAnalysis from './AggregationAnalysis.js'
import AggregationDescriptionEditor from './AggregationDescriptionEditor.js'


export default function({aggregationDescription, aggregatedDocumentBudgetaire, documentBudgetairesWithPlanDeCompte, selectedList, aggregationDescriptionMutations, millerColumnSelection, triggerAggregationDescriptionDownload, importAggregationDescription, selectedPlanDeCompte}){

    return html`
        <div>
            <${AggregationDescriptionEditor} ...${ {aggregationDescription, aggregatedDocumentBudgetaire, selectedList, aggregationDescriptionMutations, millerColumnSelection, triggerAggregationDescriptionDownload, importAggregationDescription, planDeCompte: selectedPlanDeCompte} } />
            <${AggregationAnalysis} ...${ {aggregationDescription, documentBudgetairesWithPlanDeCompte} } />
        </div>
    `
}
