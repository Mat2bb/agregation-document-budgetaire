import {h, Component} from 'preact'

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