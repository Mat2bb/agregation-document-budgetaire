import {h} from 'preact'

function DocumentBudgetaireInput({onNewDocumentBudgetaireText}){

    function onChange(e){
        for(const file of e.target.files){
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = e => onNewDocumentBudgetaireText(e.target.result);
            // MISSING error case
        }
    }

    return html`
        <label>
            Charger un ou plusieurs <a target="_blank" href="https://github.com/DavidBruant/colors-of-the-finances/blob/master/docs/format-fichier.md">Document Budgetaire (format xml)</a>
            <input type="file" multiple onChange=${onChange} />
        </label>
    `
}

export default function({documentBudgetairesWithPlanDeCompte, selected, onNewDocumentBudgetaireText, onSelectDocumentBudgetaire, errors}){

    return html`
        <header>
            <h1>Agrégation de Document Budgétaire</h1>
            <section>
                <h2>Documents Budgétaires</h2>
                ${
                        html`
                            <div>
                                Documents budgétaires chargés : 
                                    ${
                                        documentBudgetairesWithPlanDeCompte.length === 0 ? 
                                            ' (aucun)' : 
                                            html`<ul class="documents-budgetaires">
                                                ${
                                                    documentBudgetairesWithPlanDeCompte.map(dbwpc => 
                                                        html`<li class="${selected === dbwpc ? 'selected' : ''}" onClick=${e => onSelectDocumentBudgetaire(dbwpc)}>
                                                            ${dbwpc.documentBudgetaire["LibelleColl"]} - (${dbwpc.documentBudgetaire["Nomenclature"]}) - <strong>${dbwpc.documentBudgetaire["Exer"]}</strong>
                                                        </li>`
                                                    )
                                                }
                                            </ul>`
                                    }
                            </div>
                        `
                }

                ${
                    errors && errors.map(err => {
                        return html`
                            <strong class="error">Erreur : ${err}</strong>
                        `
                    })
                }

                <${DocumentBudgetaireInput} onNewDocumentBudgetaireText=${onNewDocumentBudgetaireText} />
            </section>
        </header>
    `
}
