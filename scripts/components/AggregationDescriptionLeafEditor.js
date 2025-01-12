import {h, Component} from 'preact'

import {aggregatedDocumentBudgetaireNodeTotal} from '../finance/AggregationDataStructures.js'


class FormulaEditor extends Component {  
    constructor(props) {
        super(props);
        this.state = {
            value: props.formula
        }

        const {onFormulaChange} = props;

        this.inputElement = undefined;

        this.setTextInputRef = element => {
            this.inputElement = element;
        };

        this.handleChange = e => {
            const value = e.target.value
            
            this.selectionStart = this.inputElement.selectionStart
            this.selectionEnd = this.inputElement.selectionEnd

            onFormulaChange(value)
        }

        this.buttonClick = e => {
            const selectionStart = this.inputElement.selectionStart;
            const selectionEnd = this.inputElement.selectionEnd;
            const currentValue = this.inputElement.value;
            const buttonValue = e.target.getAttribute('data-add')
            const newValue = currentValue.slice(0, selectionStart) + buttonValue + currentValue.slice(selectionStart);

            this.selectionStart = selectionStart + (buttonValue.length)
            this.selectionEnd = selectionEnd + (buttonValue.length)

            onFormulaChange(newValue)
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({value: nextProps.formula})
    }

    componentDidMount() {
        // autofocus the input on mount
        this.inputElement.focus();
    }

    componentDidUpdate(){
        this.inputElement.focus();
        this.inputElement.setSelectionRange(this.selectionStart, this.selectionEnd);
    }

    render(props, {value: formula}) {

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
                        [
                            {add:'F', legend: 'F(onction)'}, 
                            {add:'C', legend: 'C(compte)'}, 
                            {add:'Ch', legend: 'Ch(apitre)'}, 
                            {add:'Ann', legend: 'Ann(ée)'}
                        ]
                        .map(({add, legend}) => html`<button data-add="${add}" onClick=${this.buttonClick}>${legend}</button>`)
                    }
                </div>
                <textarea autocomplete="off" spellcheck=${false} rows="2" value=${formula} ref=${this.setTextInputRef} onInput=${this.handleChange}></textarea>
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