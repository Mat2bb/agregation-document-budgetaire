import {h, Component} from 'preact'

import {aggregatedDocumentBudgetaireNodeElements, aggregatedDocumentBudgetaireNodeTotal} from '../finance/AggregationDataStructures.js'


class FormulaEditor extends Component {  
    constructor(props) {
        super(props);

        const {onFormulaChange} = props;

        this.inputElement = undefined;

        this.setTextInputRef = element => {
            this.inputElement = element;
        };

        this.focusTextInput = () => {
            // Focus the text input using the raw DOM API
            if (this.inputElement){
                this.inputElement.focus();
            }
        };

        this.handleChange = e => {
            const value = e.target.value
            onFormulaChange(value)
        }

        this.buttonClick = e => {
            const cursorPosition = this.inputElement.selectionStart;
            const currentValue = this.inputElement.value;
            const newValue = currentValue.slice(0, cursorPosition) + e.target.getAttribute('data-add') + currentValue.slice(cursorPosition);

            this.inputElement.value = newValue;
            onFormulaChange(newValue)

            const newPosition = cursorPosition + (e.target.getAttribute('data-add').length)

            this.inputElement.focus()
            this.inputElement.setSelectionRange(newPosition, newPosition);
        }
    }

    componentDidMount() {
        // autofocus the input on mount
        this.focusTextInput();
    }

    render({formula}) {
        // RF∩(N7478141 ∪ N7478142 ∪ N74788∩F53∩Ann2016)

        return html`
            <section class="formula-editor">
                <div class="buttons">
                    ${
                        [{add:'DF', legend: 'DF'}, {add:'RF', legend: 'RF'}, {add:'DI', legend: 'DI'}, {add:'RI', legend: 'RI'}]
                        .map(({add, legend}) => html`<button data-add="${add}" onClick=${this.buttonClick}>${legend}</button>`)
                    }
                </div>
                <div class="buttons">
                    ${
                        [{add:'∩', legend: '∩'}, {add:'∪', legend: '∪'}]
                        .map(({add, legend}) => html`<button data-add="${add}" onClick=${this.buttonClick}>${legend}</button>`)
                    }
                </div>
                <div class="buttons">
                    ${
                        [{add:'F', legend: 'F(onction)'}, {add:'C', legend: 'C(compte)'}, {add:'Ch', legend: 'Ch(apitre)'}]
                        .map(({add, legend}) => html`<button data-add="${add}" onClick=${this.buttonClick}>${legend}</button>`)
                    }
                </div>
                <input type="text" defaultValue=${formula} ref=${this.setTextInputRef} onInput=${this.handleChange} />  
            </section>
        `
    }
}


export default function AggregationDescriptionLeafEditor({
    aggregationDescriptionLeaf, aggregatedDocumentBudgetaireCorrespondingNode, planDeCompte, onFormulaChange
}){
    const {id, name, formula} = aggregationDescriptionLeaf

    return html`
        <div class="formula-editor-with-preview">
            <h1>${name} <small>(${id})</small></h1>
            <div>
                <strong>Formule</strong> <a class="help" target="_blank" href="./exemples_formules.html">?</a>
                <${FormulaEditor} key=${id} formula=${formula} onFormulaChange=${onFormulaChange}/>
                
                ${
                    aggregatedDocumentBudgetaireCorrespondingNode ?
                        html`<table class="summary">
                            <tr>
                                <td>Nombre d'éléments</td>
                                <td>
                                    <strong>
                                        ${aggregatedDocumentBudgetaireCorrespondingNode.elements.size}
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
                                    [...aggregatedDocumentBudgetaireCorrespondingNode.elements]
                                        .sort((r1, r2) => r2['MtReal'] - r1['MtReal']).map(r => {
                                        return html`
                                            <tr>
                                                <td>${r['CodRD']+planDeCompte.ligneBudgetFI(r)}</td>
                                                <td>${r['Fonction']}</td>
                                                <td>${r['Nature']}</td>
                                                <td class="money-amount">${r['MtReal'].toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</td>
                                            </tr>`
                                    })
                                }      
                            </tbody>
                        </table>` :
                        undefined
                    }
            </div>
        </div>
    `    
}