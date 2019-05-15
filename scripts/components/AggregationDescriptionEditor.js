import { List } from 'immutable';
import {h, Component} from 'preact'

import {aggregatedDocumentBudgetaireNodeElements, aggregatedDocumentBudgetaireNodeTotal, AggregationDescriptionFromJSON} from '../finance/AggregationDataStructures.js'


function AggregationDescriptionLeafEditor({
    aggregationDescriptionLeaf, aggregatedDocumentBudgetaireCorrespondingNode, onIdChange, onNameChange, onFormulaChange
}){
    const {id, name, formula} = aggregationDescriptionLeaf

    /*
        <input type="text" value=${id} onInput=${onIdChange} />
        <input type="text" value=${name} onInput=${onNameChange} />
    */

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
                            ${aggregatedDocumentBudgetaireNodeTotal(aggregatedDocumentBudgetaireCorrespondingNode).toFixed(2)+'€'}
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
                            aggregatedDocumentBudgetaireCorrespondingNode.elements.toArray().map(r => {
                                return html`
                                    <tr>
                                        <td>${r['CodRD']+r['FI']}</td>
                                        <td>${r['Fonction']}</td>
                                        <td>${r['Nature']}</td>
                                        <td class="money-amount">${r['MtReal'].toFixed(2)+'€'}</td>
                                    </tr>`
                            })
                        }      
                    </tbody>
                </table>
            </div>
        </div>
    `    
}


class MillerColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {adding: false};
    }

    render({aggregationDescription, addChild, removeChild, onNodeSelection, selectedChildId, isLast}, {adding}) {

        return (
            html`<ol>
                ${
                    aggregationDescription.children.valueSeq().map(node => {
                        const isSelected = node.id === selectedChildId

                        console.log('isSelected && isLast', isSelected, isLast)

                        return html`
                            <li 
                                class=${[
                                    isSelected ? 'selected' : undefined,
                                    node.children ? 'subgroup' : 'formula'
                                ].filter(x=>x).join(' ')} 
                                onClick=${() => onNodeSelection(node.id)}
                            >
                                ${
                                    isSelected && isLast ? 
                                        html`<button title="Supprimer ${node.name} et ses descendants" class="delete" onClick=${() => removeChild(node)}>x</button>` :
                                        undefined
                                }

                                <span>${node.name}</span>
                            </li>`
                    }).toArray()
                }
                <li>
                    ${
                        adding ?
                            html`<form onSubmit=${e => {
                                e.preventDefault();
                                addChild({
                                    id: e.target.querySelector('input[name="id"]').value,
                                    name: e.target.querySelector('input[name="name"]').value,
                                    type: e.target.querySelector('input[name="type"]:checked').value,
                                })
                            }}>
                                <label>
                                    Identifiant
                                    <input autocomplete="off" name="id"/>
                                </label>
                                <label>
                                    Nom
                                    <input autocomplete="off" name="name"/>
                                </label>
                                <section>
                                    Type
                                    <label>
                                        <input defaultChecked type="radio" name="type" value="subgroup"/>
                                        Sous-groupe
                                    </label>
                                    <label>
                                        <input type="radio" name="type" value="formula"/>
                                        Formule
                                    </label>
                                </section>
                                <button type="submit">ok</button>
                                <button type="button" onClick=${() => this.setState({adding: false})}>annuler</button>
                            </form>` : 
                            html`<button class="add" title="Rajouter un élément" onClick=${() => this.setState({adding: true})}>+</button>`
                    }
                </li>
            </ol>`
        );
    }
}

// https://en.wikipedia.org/wiki/Miller_columns
function MillerColumns({aggregationDescription, aggregatedDocumentBudgetaire, selectedList, aggregationDescriptionMutations: {addChild, removeChild, selectNode: onNodeSelection, changeFormula: onFormulaChange}}){

    const firstSelectedId = selectedList.first();

    return html`<section class="miller-columns">
        <h2>Création/édition</h2>
        <div class="columns">
            <${MillerColumn} 
                aggregationDescription=${aggregationDescription} 
                selectedChildId=${firstSelectedId}
                isLast=${selectedList.size === 1}
                addChild=${childData => { addChild(aggregationDescription, childData) } }
                removeChild=${child => { removeChild(aggregationDescription, child) }}
                onNodeSelection=${id => onNodeSelection(id, 0)},
            />
            ${
                selectedList.map((id, i) => {
                    const keyPath = selectedList.slice(0, i+1).map(id => List(['children', id])).flatten()

                    const node = aggregationDescription.getIn(keyPath)

                    return node.children ? 
                        html`<${MillerColumn} 
                            aggregationDescription=${node} 
                            selectedChildId=${selectedList.get(i+1)}
                            isLast=${i === selectedList.size - 2}
                            addChild=${childData => { addChild(node, childData) } }
                            removeChild=${child => { removeChild(node, child) }}
                            onNodeSelection=${id => onNodeSelection(id, i+1)},
                        />` :
                        html`<${AggregationDescriptionLeafEditor} 
                            aggregationDescriptionLeaf=${node}
                            aggregatedDocumentBudgetaireCorrespondingNode=${aggregatedDocumentBudgetaire.getIn(keyPath)}
                            onFormulaChange=${formula => onFormulaChange(node, formula)}
                        />`
                }).toArray()
            }
        </div>
    </section>`
}


function AggregationDescriptionImportExport({triggerAggregationDescriptionDownload, importAggregationDescription}){
    return html`<section class="aggregation-description-import-export">
        <section class="import">
            <h2>Import</h2>
            Importer un fichier de description d'agrégation
            <input type="file" onChange=${(e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.readAsText(file, "UTF-8");
                    reader.onload = e => importAggregationDescription(AggregationDescriptionFromJSON(JSON.parse(e.target.result)));
                    // TODO error case
                }
            }}/>
        </section>
        <section class="export">
            <h2>Export</h2>
            <button onClick=${triggerAggregationDescriptionDownload}>Exporter au format JSON</button>
        </section>
    </section>`
}


export default function(props){
    const {aggregationDescription, triggerAggregationDescriptionDownload, importAggregationDescription} = props

    return html`<section>
        <h1>Description d'aggrégation</h1>
        <${AggregationDescriptionImportExport} ...${ {aggregationDescription, triggerAggregationDescriptionDownload, importAggregationDescription} } />
        <${MillerColumns} ...${props}/>
    </section>`
}