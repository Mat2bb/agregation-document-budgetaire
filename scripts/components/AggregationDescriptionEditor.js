import {h, Component} from 'preact'

/*
class AggregationDescriptionLeafEditor extends Component{

    constructor(props) {
        super(props);
        this.state = {focused: false};
    }
    
    render({aggregationDescriptionLeaf, testedAggregatedDocumentBudgetaireNodeData, onIdChange, onNameChange, onFormulaChange}, {focused}){
        const {id, name, formula} = aggregationDescriptionLeaf
        const {count, amount} = testedAggregatedDocumentBudgetaireNodeData
        // amount: sum(rows.toJS().map(r => r['MtReal']))

        return html`
            <div class="formula-editor">
                <input type="text" value=${id} onInput=${onIdChange}/>
                <input type="text" value=${name} onInput=${onNameChange}/>
                <div class="formula">
                    <input type="text" value=${formula} onInput=${onFormulaChange} 
                        onFocus=${() => this.setState({focused: true})}
                        onBlur=${() => this.setState({focused: false})}
                        />
                    ${
                        focused && rows.size >= 1 ?
                            html`
                                <table class="formula-rows">
                                    <thead>
                                        <tr>
                                            ${['RDFI', 'Fonction', 'Nature', 'Montant'].map(s => html`<th>${s}</th>`)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${
                                            rows.toArray().map(r => {
                                                return html`
                                                    <tr>
                                                        <td>${r['CodRD']+r['FI']}</td>
                                                        <td>${r['Fonction']}</td>
                                                        <td>${r['Nature']}</td>
                                                        <td class="money-amount">${r['MtReal'].toFixed(2)+'€'}</td>
                                                    </tr>
                                                `
                                            })
                                        }
                                    </tbody>
                                </table>
                            ` : 
                            undefined

                    }
                </div>
                <span>${count}</span>
                <span>${amount.toFixed(2)+'€'}</span>
            </div>
        `
    }
}
*/

class MillerColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {adding: false};
    }

    render({aggregationDescription, addChild}, {adding}) {
        console.log('MillerColumn', aggregationDescription.children.toJS())

        return (
            html`<ol>
                ${
                    aggregationDescription.children.valueSeq().map(node => {
                        return html`<li>${node.name}</li>`
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
                                    <input name="id"/>
                                </label>
                                <label>
                                    Nom
                                    <input name="name"/>
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
function MillerColumns({aggregationDescription, addChild, selectedList}){
    return html`<section class="miller-columns">
        <${MillerColumn} aggregationDescription=${aggregationDescription} addChild=${childData => {
            addChild(aggregationDescription, childData)
        }} />
    </section>`
}


export default function({aggregationDescription, aggregationDescriptionMutations: {addChild}}){
    return html`<${MillerColumns} ...${ {aggregationDescription, addChild} }/>`
}



/*
export default function({aggregationDescriptionLeaf, testedAggregatedDocumentBudgetaireNodeData, onIdChange, onNameChange, onFormulaChange}){

    return aggregationDescriptionNode.formula ?
        html`
            <${AggregationDescriptionLeafEditor} ...${ {aggregationDescriptionLeaf, testedAggregatedDocumentBudgetaireNodeData, onIdChange, onNameChange, onFormulaChange} }>
        ` : 



    return html`
        <div>
            <${AggregationTable} ...${ {aggregation, addFormula, changeFormula} } />
            <${AggregationAnalysis} aggregation=${aggregation} documentBudgetaire=${documentBudgetaire} />
        </div>
    `

}
*/