import {h} from 'preact'
import {sum} from 'd3-array'

import AggregationTableRow from './AggregationTableRow.js'

// formula id that must be usable as formula identifier
function randomUsableId(){
    return 'ID_'+(Math.random().toString(36).slice(2))
}

export default function AggregationTable({aggregation, addFormula, changeFormula}){
    return html`
        <table class="aggregation">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Formule</th>
                    <th>Nombre</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${ 
                    aggregation.map(ag => {
                        const {id, name, formula} = ag
                        
                        function onNameChange({target}){
                            changeFormula( {id, name: target.value, formula} )
                        }
                        function onFormulaChange({target}){
                            changeFormula( {id, name, formula: target.value} )
                        }

                        return html`
                            <${AggregationTableRow} key=${ag.id} ...${ag} onNameChange=${onNameChange} onFormulaChange=${onFormulaChange} />`
                    })
                        
                }

                <tr onClick=${() => addFormula({id: randomUsableId(), name: '', formula: ''})}>
                    <td colspan="4">+ Ajouter une ligne</td>
                </tr>
            </tbody>
        </table>
    `
}