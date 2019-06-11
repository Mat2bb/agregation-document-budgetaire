import debounce from 'lodash-es/debounce';
import {h, Component} from 'preact'

import makeAggregateFunction from '../finance/makeAggregateFunction.js';
import { getAggregatedDocumentBudgetaireLeavesToAnalyze } from '../finance/AggregationDataStructures.js';

function makeUnusedLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire, aggregationDescription){
    const leaves = getAggregatedDocumentBudgetaireLeavesToAnalyze(aggregatedDocumentBudgetaire, aggregationDescription)
    const usedLigneBudgets = new Set()
    
    for(const leaf of leaves){
        for(const lb of leaf.elements){
            usedLigneBudgets.add(lb);
        }
    }

    return [...documentBudgetaire.rows].filter(ligneBudget => !usedLigneBudgets.has(ligneBudget))
}

function makeUsedMoreThanOnceLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire, aggregationDescription){
    const leaves = getAggregatedDocumentBudgetaireLeavesToAnalyze(aggregatedDocumentBudgetaire, aggregationDescription)

    const aggregationSetsByRow = new Map()

    for(const ligneBudget of documentBudgetaire.rows){
        const aggregationSets = []
        for(const aggLeaf of leaves){
            if(aggLeaf.elements.has(ligneBudget)){
                aggregationSets.push(aggLeaf)
            }
        }

        if(aggregationSets.length >= 2){
            aggregationSetsByRow.set(ligneBudget, aggregationSets)
        }
    }

    return [...aggregationSetsByRow.entries()]
        .map(([row, aggregationSets]) => ({row, aggregationSets}))
}


export default class AggregationAnalysis extends Component{
    // heavily inspired of https://github.com/podefr/react-debounce-render/blob/master/src/index.js (MIT)
    
    constructor(props){
        super(props);
        this.updateDebounced = debounce(this.forceUpdate, 1000);
    }
    
    shouldComponentUpdate() {
        this.updateDebounced();
        return false;
    }

    componentWillUnmount() {
        this.updateDebounced.cancel();
    }

    render({aggregationDescription, documentBudgetairesWithPlanDeCompte}){

        if(documentBudgetairesWithPlanDeCompte.length === 0){
            return undefined;
        }

        const analyzedDocBudgs = documentBudgetairesWithPlanDeCompte.map(
            ({documentBudgetaire, planDeCompte}) => {
                const aggregated = makeAggregateFunction(aggregationDescription, planDeCompte)(documentBudgetaire);

                return {
                    documentBudgetaire,
                    planDeCompte,
                    unusedRows: makeUnusedLigneBudgetSet(documentBudgetaire, aggregated, aggregationDescription),
                    rowsUsedMoreThanOnce: makeUsedMoreThanOnceLigneBudgetSet(
                        documentBudgetaire, aggregated, aggregationDescription
                    )
                }
            }
        )
    
        return html`
            <section class="analysis">
                <h1>Analyse</h1>
                ${
                    analyzedDocBudgs.map(({documentBudgetaire}) => {
                        return html`<p>
                            Il y a ${documentBudgetaire && documentBudgetaire.rows.size} lignes dans le document budgetaire ${documentBudgetaire["LibelleColl"]} - <strong>${documentBudgetaire["Exer"]}</strong>
                        </p>`
                    })

                }
                
    
                <h2>Lignes non-utilisées</h2>
                ${
                    analyzedDocBudgs.map(({documentBudgetaire, planDeCompte, unusedRows}) => {
                        return html`
                            <details>
                                <summary>
                                    <h3>
                                        ${documentBudgetaire["LibelleColl"]} - <strong>${documentBudgetaire["Exer"]}</strong> (${unusedRows.length})
                                    </h3>
                                </summary>
                                <table>
                                    ${
                                        unusedRows.map(row => {
                                            return html`
                                                <tr>
                                                    <td>${row["CodRD"]}${planDeCompte.ligneBudgetFI(row)}</td>
                                                    <td>F${row["Fonction"]}</td>
                                                    <td>Ch${planDeCompte.ligneBudgetChapitre(row)}</td>
                                                    <td>C${row["Nature"]}</td>
                                                    <td class="money-amount">${row["MtReal"].toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</td>
                                                </tr>
                                            `
                                        })
                                    }
                                </table>
                            </details>`
                    })
                }

                <h2>Lignes utilisées plus qu'une fois</h2>
                ${
                    analyzedDocBudgs.map(({documentBudgetaire, planDeCompte, rowsUsedMoreThanOnce}) => {
                        return html`
                            <details>
                                <summary>
                                    <h3>
                                        ${documentBudgetaire["LibelleColl"]} - <strong>${documentBudgetaire["Exer"]}</strong> (${rowsUsedMoreThanOnce.length})
                                    </h3>
                                </summary>
                                <table>
                                    ${
                                        rowsUsedMoreThanOnce.map(({row, aggregationSets}) => {
                                            return html`
                                                <tr>
                                                    <td>${row["CodRD"]}${planDeCompte.ligneBudgetFI(row)} F${row["Fonction"]} Ch${planDeCompte.ligneBudgetChapitre(row)} C${row["Nature"]}</td>
                                                    <td>${
                                                        aggregationSets.map(({name}) => name).join(' & ')
                                                    }</td>
                                                </tr>
                                            `
                                        })
                                    }
                                </table>
                            </details>`
                    })
                }
                
    
    
            </section>
        `
    }
}

/*

                
    
                
*/