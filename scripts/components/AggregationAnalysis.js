import { Set as ImmutableSet } from 'immutable';
import {h} from 'preact'

import makeAggregateFunction from '../finance/makeAggregateFunction.js';
import { getAggregatedDocumentBudgetaireLeaves } from '../finance/AggregationDataStructures.js';

function makeUnusedLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire){
    const leaves = getAggregatedDocumentBudgetaireLeaves(aggregatedDocumentBudgetaire)
    const usedLigneBudgets = ImmutableSet.union(leaves.map(l => l.elements))

    return documentBudgetaire.rows.filter(ligneBudget => !usedLigneBudgets.has(ligneBudget)).toArray()
}

function makeUsedMoreThanOnceLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire){
    const leaves = getAggregatedDocumentBudgetaireLeaves(aggregatedDocumentBudgetaire)

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


export default function({aggregationDescription, documentBudgetaires}){

    const aggregate = makeAggregateFunction(aggregationDescription)
    const aggregatedDocumentBudgetaires = documentBudgetaires.map(aggregate)

    const documentBudgetaire = documentBudgetaires[0];
    const aggregatedDocumentBudgetaire = aggregatedDocumentBudgetaires[0];

    const unusedRows = documentBudgetaire ?
        makeUnusedLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire) : 
        [];
    const rowsUsedMoreThanOnce = documentBudgetaire ?
        makeUsedMoreThanOnceLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire) : 
        [];

    return html`
        <section>
            <h1>Analyse</h1>
            <p>Il y a ${documentBudgetaire && documentBudgetaire.rows.size} lignes dans le document budgetaire</p>

            <h2>Lignes non-utilisées (${unusedRows.length})</h2>
            <table>
                ${
                    unusedRows.map(row => {
                        return html`
                            <tr>
                                <td>${row["CodRD"]}${row["FI"]}</td>
                                <td>F${row["Fonction"]}</td>
                                <td>C${row["Chapitre"]}</td>
                                <td>N${row["Nature"]}</td>
                                <td>${row["MtReal"]}</td>
                            </tr>
                        `
                    })
                }
            </table>

            <h2>Lignes utilisées plus qu'une fois (${rowsUsedMoreThanOnce.length})</h2>
            <table>
                ${
                    rowsUsedMoreThanOnce.map(({row, aggregationSets}) => {
                        return html`
                            <tr>
                                <td>${row["CodRD"]}${row["FI"]} F${row["Fonction"]} C${row["Chapitre"]} N${row["Nature"]}</td>
                                <td>${
                                    aggregationSets.map(({name}) => name).join(' & ')
                                }</td>
                            </tr>
                        `
                    })
                }
            </table>


        </section>
    `
}
