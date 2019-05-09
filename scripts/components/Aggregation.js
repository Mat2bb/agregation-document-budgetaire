import {h} from 'preact'

import AggregationAnalysis from './AggregationAnalysis.js'
import AggregationDescriptionEditor from './AggregationDescriptionEditor.js'


export default function({aggregationDescription, aggregatedDocumentBudgetaire, documentBudgetaire, selectedList, aggregationDescriptionMutations, triggerAggregationDescriptionDownload}){
    return html`
        <div>
            <${AggregationDescriptionEditor} ...${ {aggregationDescription, aggregatedDocumentBudgetaire, selectedList, aggregationDescriptionMutations, triggerAggregationDescriptionDownload} } />
            <${AggregationAnalysis} ...${ {aggregationDescription, documentBudgetaires: documentBudgetaire ? [documentBudgetaire] : []} } />
        </div>
    `
}
