import {h} from 'preact'

import AggregationAnalysis from './AggregationAnalysis.js'
import AggregationDescriptionEditor from './AggregationDescriptionEditor.js'


export default function({aggregationDescription, selectedList, aggregation, documentBudgetaire, aggregationDescriptionMutations}){
    return html`
        <div>
            <${AggregationDescriptionEditor} ...${ {aggregationDescription, selectedList, aggregationDescriptionMutations} } />
            
        </div>
    `
    // <${AggregationAnalysis} aggregation=${aggregation} documentBudgetaire=${documentBudgetaire} />
}

