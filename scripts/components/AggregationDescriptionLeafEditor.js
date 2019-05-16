import {h} from 'preact'

import {aggregatedDocumentBudgetaireNodeElements, aggregatedDocumentBudgetaireNodeTotal} from '../finance/AggregationDataStructures.js'


export default function AggregationDescriptionLeafEditor({
    aggregationDescriptionLeaf, aggregatedDocumentBudgetaireCorrespondingNode, onFormulaChange
}){
    const {id, name, formula} = aggregationDescriptionLeaf

    return html`
        <div class="formula-editor">
            <h1>${name} <small>(${id})</small></h1>
            <div>
                <strong>Formule</strong> <a class="help" target="_blank" href="./exemples_formules.html">?</a>
                <input type="text" value=${formula} onInput=${e => onFormulaChange(e.target.value)} />
                <table class="summary">
                    <tr>
                        <td>Nombre d'éléments</td>
                        <td>
                            <strong>
                                ${aggregatedDocumentBudgetaireNodeElements(aggregatedDocumentBudgetaireCorrespondingNode).size}
                            </strong>
                        </td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td class="money-amount">
                            <strong>
                            ${aggregatedDocumentBudgetaireNodeTotal(aggregatedDocumentBudgetaireCorrespondingNode).toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}
                            </strong>
                        </td>
                    </tr>
                </table>
                <table class="formula-rows">
                    <thead>
                        <tr>
                            ${['RDFI', 'Fonction', 'Nature', 'Montant'].map(s => html`<th>${s}</th>`)}
                        </tr>
                    </thead>
                    <tbody>
                        ${
                            aggregatedDocumentBudgetaireCorrespondingNode.elements
                                .toArray().sort((r1, r2) => r2['MtReal'] - r1['MtReal']).map(r => {
                                return html`
                                    <tr>
                                        <td>${r['CodRD']+r['FI']}</td>
                                        <td>${r['Fonction']}</td>
                                        <td>${r['Nature']}</td>
                                        <td class="money-amount">${r['MtReal'].toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</td>
                                    </tr>`
                            })
                        }      
                    </tbody>
                </table>
            </div>
        </div>
    `    
}