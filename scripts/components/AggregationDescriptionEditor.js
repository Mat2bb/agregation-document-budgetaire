import { List } from 'immutable';
import {h, Component} from 'preact'


function AggregationDescriptionLeafEditor({
    aggregationDescriptionLeaf, aggregatedDocumentBudgetaireCorrespondingNode, onIdChange, onNameChange, onFormulaChange
}){
    const {id, name, formula} = aggregationDescriptionLeaf
    //const {count, amount} = testedAggregatedDocumentBudgetaireNodeData
    // amount: sum(rows.toJS().map(r => r['MtReal']))

    //<span>${count}</span>
    //<span>${amount.toFixed(2)+'€'}</span>

    /*
        <input type="text" value=${id} onInput=${onIdChange} />
        <input type="text" value=${name} onInput=${onNameChange} />
    */

    return html`
        <div class="formula-editor">
            <h1>${name} <small>${id}</small></h1>
            <div class="formula">
                <input type="text" value=${formula} onInput=${e => onFormulaChange(e.target.value)} />
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

    render({aggregationDescription, addChild, onNodeSelection, selectedChildId}, {adding}) {

        return (
            html`<ol>
                ${
                    aggregationDescription.children.valueSeq().map(node => {
                        return html`
                            <li 
                                class=${[
                                    node.id === selectedChildId ? 'selected' : undefined,
                                    node.children ? 'subgroup' : 'formula'
                                ].filter(x=>x).join(' ')} 
                                onClick=${() => onNodeSelection(node.id === selectedChildId ? undefined : node.id)}
                            >
                                ${node.name}
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
                            html`<button onClick=${() => this.setState({adding: true})}>+</button>`
                    }
                </li>
            </ol>`
        );
    }
}

// https://en.wikipedia.org/wiki/Miller_columns
export default function MillerColumns({aggregationDescription, aggregatedDocumentBudgetaire, selectedList, aggregationDescriptionMutations: {addChild, selectNode: onNodeSelection, changeFormula: onFormulaChange}}){

    const firstSelectedId = selectedList.first();

    return html`<section class="miller-columns">
        <${MillerColumn} 
            aggregationDescription=${aggregationDescription} 
            selectedChildId=${firstSelectedId}
            addChild=${childData => { addChild(aggregationDescription, childData) } }
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
                        addChild=${childData => { addChild(node, childData) } }
                        onNodeSelection=${id => onNodeSelection(id, i+1)},
                    />` :
                    html`<${AggregationDescriptionLeafEditor} 
                        aggregationDescriptionLeaf=${node}
                        aggregatedDocumentBudgetaireCorrespondingNode=${aggregatedDocumentBudgetaire.getIn(keyPath)}
                        onFormulaChange=${formula => onFormulaChange(node, formula)}
                    />`
            }).toArray()

        }
    </section>`
}
