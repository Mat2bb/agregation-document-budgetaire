import {h} from 'preact'

import AggregationAnalysis from './AggregationAnalysis.js'
import AggregationDescriptionEditor from './AggregationDescriptionEditor.js'


export default function({aggregationDescription, aggregatedDocumentBudgetaire, selectedList, aggregationDescriptionMutations}){
    return html`
        <div>
            <${AggregationDescriptionEditor} ...${ {aggregationDescription, aggregatedDocumentBudgetaire, selectedList, aggregationDescriptionMutations} } />
            
        </div>
    `
    // <${AggregationAnalysis} aggregation=${aggregation} documentBudgetaire=${documentBudgetaire} />
}
