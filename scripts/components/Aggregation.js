import {h} from 'preact'

import AggregationAnalysis from './AggregationAnalysis.js'
import AggregationDescriptionEditor from './AggregationDescriptionEditor.js'


export default function({aggregationDescription, aggregatedDocumentBudgetaire, documentBudgetairesWithPlanDeCompte, selectedList, aggregationDescriptionMutations, triggerAggregationDescriptionDownload, importAggregationDescription}){

    const planDeCompte = documentBudgetairesWithPlanDeCompte[0] && documentBudgetairesWithPlanDeCompte[0].planDeCompte

    return html`
        <div>
            <${AggregationDescriptionEditor} ...${ {aggregationDescription, aggregatedDocumentBudgetaire, selectedList, aggregationDescriptionMutations, triggerAggregationDescriptionDownload, importAggregationDescription, planDeCompte} } />
            <${AggregationAnalysis} ...${ {aggregationDescription, documentBudgetairesWithPlanDeCompte} } />
        </div>
    `
}
