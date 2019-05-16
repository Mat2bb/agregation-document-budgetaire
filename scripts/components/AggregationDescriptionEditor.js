import { List } from 'immutable';
import {h, Component} from 'preact'

import {AggregationDescriptionFromJSON} from '../finance/AggregationDataStructures.js'
import AggregationDescriptionLeafEditor from './AggregationDescriptionLeafEditor.js'

class MillerColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adding: false,
            editingNode: undefined
        };
    }

    render({aggregationDescription, addChild, editChild, removeChild, onNodeSelection, selectedChildId, isLast}, {adding, editingNode}) {

        return (
            html`<ol>
                ${
                    aggregationDescription.children.valueSeq().toArray().map(node => {
                        const isSelected = node.id === selectedChildId

                        return !editingNode || editingNode.id !== node.id ? 
                            html`
                                <li 
                                    class=${[
                                        isSelected ? 'selected' : undefined,
                                        node.children ? 'group' : 'formula'
                                    ].filter(x=>x).join(' ')} 
                                    onClick=${() => onNodeSelection(node.id)}
                                >
                                    ${
                                        isSelected && isLast ? 
                                            html`<button title="Éditer" class="edit" onClick=${() => this.setState({editingNode: node})}>✎</button>` :
                                            undefined
                                    }

                                    <span>${node.name}</span>
                                </li>` :
                            undefined
                    })
                }
                <li>
                    ${
                        adding || editingNode ?
                            html`<form onSubmit=${e => {
                                e.preventDefault();
                                const childData = {
                                    id: e.target.querySelector('input[name="id"]').value,
                                    name: e.target.querySelector('input[name="name"]').value,
                                    type: e.target.querySelector('input[name="type"]:checked').value,
                                };

                                if(editingNode){
                                    editChild(editingNode, childData)
                                }
                                else{ // adding
                                    addChild(childData)
                                }

                                this.setState({
                                    adding: false,
                                    editingNode: undefined
                                })
                            }}>
                                <label>
                                    Codification unique
                                    <input autocomplete="off" name="id" placeholder="DF.1.7.2" defaultValue=${editingNode && editingNode.id}/>
                                </label>
                                <label>
                                    Nom
                                    <input autocomplete="off" name="name" defaultValue=${editingNode && editingNode.name}/>
                                </label>
                                <section>
                                    Type
                                    <label>
                                        <input defaultChecked=${editingNode ? editingNode.children : true} type="radio" name="type" value="group"/>
                                        Groupe
                                    </label>
                                    <label>
                                        <input defaultChecked=${editingNode && ('formula' in editingNode)}  type="radio" name="type" value="formula"/>
                                        Formule
                                    </label>
                                </section>
                                <section>
                                    <button type="submit">ok</button>
                                    <button type="button" onClick=${() => this.setState({adding: false, editingNode: undefined})}>annuler</button>
                                </section>
                                ${
                                    editingNode ? 
                                        html`<button type="button" class="delete" title="Supprimer" onClick=${() => {
                                            removeChild(editingNode);
                                            this.setState({adding: false, editingNode: undefined});
                                        } }>Supprimer</button>` :
                                        undefined
                                }
                            </form>` : 
                            html`<button class="add" title="Rajouter un élément" onClick=${() => this.setState({adding: true})}>+</button>`
                    }
                </li>
            </ol>`
        );
    }
}

// https://en.wikipedia.org/wiki/Miller_columns
function MillerColumns({aggregationDescription, aggregatedDocumentBudgetaire, selectedList, aggregationDescriptionMutations: {addChild, removeChild, editChild, selectNode, changeFormula}}){

    const firstSelectedId = selectedList.first();

    return html`<section class="miller-columns">
        <h2>Création/édition</h2>
        <div class="columns">
            <${MillerColumn} 
                aggregationDescription=${aggregationDescription} 
                selectedChildId=${firstSelectedId}
                isLast=${selectedList.size === 1}
                addChild=${childData => { addChild(aggregationDescription, childData) } }
                editChild=${(node, childData) => editChild(aggregationDescription, node, childData)}
                removeChild=${child => { removeChild(aggregationDescription, child) }}
                onNodeSelection=${id => selectNode(id, 0)},
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
                            editChild=${(currentChild, childData) => editChild(node, currentChild, childData)}
                            removeChild=${child => { removeChild(node, child) }}
                            onNodeSelection=${id => selectNode(id, i+1)},
                        />` :
                        html`<${AggregationDescriptionLeafEditor} 
                            aggregationDescriptionLeaf=${node}
                            aggregatedDocumentBudgetaireCorrespondingNode=${aggregatedDocumentBudgetaire.getIn(keyPath)}
                            onFormulaChange=${formula => changeFormula(node, formula)}
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