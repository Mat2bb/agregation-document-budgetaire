import {h} from 'preact'

function DocumentBudgetaireInput({errorMessage, onNewDocumentBudgetaireText}){

    function onChange(e){
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = e => onNewDocumentBudgetaireText(e.target.result);
            // MISSING error case
        }
        else{
            // MISSING handle no-file case
        }
    }

    return html`
        <label>
            Changer de Document Budgétaire <strong>(uniquement M52 2016, 2017 ou 2018)</strong>
            <input type="file" onChange=${onChange} />
        </label>
    `
}

export default function({documentBudgetaire, onNewDocumentBudgetaireText}){

    return html`
        <header>
            <h1>Agrégation de Document Budgétaire</h1>
            <section>
                <h2>Documents Budgétaires</h2>
                ${
                        html`
                            <div>
                                Document budgétaire chargé : 
                                ${
                                    documentBudgetaire ? 
                                        ` ${documentBudgetaire["LibelleColl"]} - ${documentBudgetaire["Nomenclature"]} - ${documentBudgetaire["Exer"]}` : 
                                        ' (aucun)'
                                }
                            </div>
                        `
                }

                <${DocumentBudgetaireInput} onNewDocumentBudgetaireText=${onNewDocumentBudgetaireText} />
            </section>
        </header>
    `
}
