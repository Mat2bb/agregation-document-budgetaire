import produce from 'immer'
import {h, Component} from 'preact'

import {AggregationDescriptionFromJSON} from '../finance/AggregationDataStructures.js'
import AggregationDescriptionLeafEditor from './AggregationDescriptionLeafEditor.js'

class MillerColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adding: Object.values(props.aggregationDescription.children).length === 0,
            editingNode: undefined
        };
    }

    render({aggregationDescription, addChild, editChild, removeChild, onNodeSelection, selectedChildId, isLast}, {adding, editingNode}) {

        return (
            html`<ol>
                ${
                    Object.values(aggregationDescription.children).map(node => {
                        const isSelected = node.id === selectedChildId

                        return !editingNode || editingNode.id !== node.id ? 
                            html`
                                <li 
                                    key=${node.id}
                                    class=${[
                                        isSelected ? 'selected' : undefined,
                                        node.children ? 'group' : 'formula'
                                    ].filter(x=>x).join(' ')} 
                                    onClick=${() => onNodeSelection(isSelected ? undefined : node.id)}
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
                                
                                const newChild = e.target.querySelector('input[name="type"]:checked').value === 'group' ?
                                {
                                    id: e.target.querySelector('input[name="id"]').value,
                                    name: e.target.querySelector('input[name="name"]').value,
                                    children: editingNode && editingNode.children || Object.create(null)
                                } : 
                                {
                                    id: e.target.querySelector('input[name="id"]').value,
                                    name: e.target.querySelector('input[name="name"]').value,
                                    formula: editingNode && editingNode.formula || ''
                                };

                                if(editingNode){
                                    editChild(editingNode, newChild)
                                }
                                else{ // adding
                                    addChild(newChild)
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
function MillerColumns({aggregationDescription, aggregatedDocumentBudgetaire, planDeCompte, selectedList, aggregationDescriptionMutations: {addChild, removeChild, editChild}, millerColumnSelection: {set: setSelectionList}}){

    const firstSelectedId = selectedList[0];

    const editChildByLevel = selectedList.map((id, i) => {

        return i === 0 ? editChild : (previousChild, newChild, newSelectedList) => {
            let parent = aggregationDescription
                        
            for(const selected of selectedList.slice(0, i)){
                parent = parent.children[selected]
            }

            editChildByLevel[i-1](
                parent, 
                produce(parent, draft => {
                    const {id: newId} = newChild;
                    const {id: previousId} = previousChild;
    
                    if(previousId !== newId){
                        delete draft.children[previousId];
                    }
    
                    draft.children[newId] = newChild
                }),
                [newChild.id, ...newSelectedList]
            )
        }
    })

    return html`<section class="miller-columns">
        <h2>Création/édition</h2>
        <div class="columns">
            <${MillerColumn} 
                aggregationDescription=${aggregationDescription} 
                selectedChildId=${firstSelectedId}
                isLast=${selectedList.length === 1}
                addChild=${addChild}
                editChild=${(previousChild, newChild) => editChild(previousChild, newChild, [])}
                removeChild=${removeChild}}
                onNodeSelection=${id => setSelectionList(id ? [id] : [])},
            />
            ${
                selectedList.map((id, i) => {
                    let descriptionNode = aggregationDescription
                    let aggregatedNode = aggregatedDocumentBudgetaire
                    
                    for(const selected of selectedList.slice(0, i+1)){
                        descriptionNode = descriptionNode.children[selected]
                        aggregatedNode = aggregatedNode && aggregatedNode.children.find(c => c.id === selected)
                    }

                    const addChildDeep = newChild => {
                        editChildByLevel[i](
                            descriptionNode, 
                            produce(descriptionNode, draft => {
                                draft.children[newChild.id] = newChild;
                            }),
                            [newChild.id]
                        )
                    }

                    const removeChildDeep = childToRemove => {
                        editChildByLevel[i](
                            descriptionNode, 
                            produce(descriptionNode, draft => {
                                delete draft.children[childToRemove.id];
                            }),
                            []
                        )
                    }

                    return descriptionNode.children ? 
                        html`<${MillerColumn} 
                            key=${id}
                            aggregationDescription=${descriptionNode} 
                            selectedChildId=${selectedList[i+1]}
                            isLast=${i === selectedList.length - 2}
                            addChild=${ addChildDeep }
                            editChild=${ (previousChild, newChild) => editChildByLevel[i+1](previousChild, newChild, []) }
                            removeChild=${ removeChildDeep }}
                            onNodeSelection=${id => setSelectionList(id ? [...selectedList.slice(0, i+1), id] : selectedList.slice(0, i+1))},
                        />` :
                        html`<${AggregationDescriptionLeafEditor} 
                            aggregationDescriptionLeaf=${descriptionNode}
                            aggregatedDocumentBudgetaireCorrespondingNode=${aggregatedNode}
                            planDeCompte=${planDeCompte}
                            onFormulaChange=${formula => editChildByLevel[i](
                                descriptionNode, 
                                {id: descriptionNode.id, name: descriptionNode.name, formula}, 
                                []
                            )}
                        />`
                })
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