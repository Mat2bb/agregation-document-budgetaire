import {h} from 'preact'

import AggregationAnalysis from './AggregationAnalysis.js'
import AggregationTable from './AggregationTable.js'


export default function({aggregation, documentBudgetaire, addFormula, changeFormula}){
    return html`
        <div>
            <${AggregationTable} ...${ {aggregation, addFormula, changeFormula} } />
            <${AggregationAnalysis} aggregation=${aggregation} documentBudgetaire=${documentBudgetaire} />
        </div>
    `
}