import {h} from 'preact'

import AggregationAnalysis from './AggregationAnalysis.js'
import AggregationDescriptionEditor from './AggregationDescriptionEditor.js'


export default function({aggregationDescription, aggregation, documentBudgetaire, aggregationDescriptionMutations}){
    return html`
        <div>
            <${AggregationDescriptionEditor} ...${ {aggregationDescription, aggregationDescriptionMutations} } />
            
        </div>
    `
    // <${AggregationAnalysis} aggregation=${aggregation} documentBudgetaire=${documentBudgetaire} />
}

