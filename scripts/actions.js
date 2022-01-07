import {xml} from 'd3-fetch'

import {fromXMLDocument} from './finance/planDeCompte.js'
import xmlDocumentToDocumentBudgetaire from './finance/xmlDocumentToDocumentBudgetaire.js'

function makePlanDeCompteURL(docBudg){
    const [norme, sousNorme] = docBudg.Nomenclature.split('-');
    const année = docBudg.Exer;

    //return `https://dtc-innovation.github.io/plans-de-compte/${année}/${norme}/${sousNorme}/planDeCompte.xml`
    // Modif MWO
    return `https://mat2bb.github.io/agregation-document-budgetaire/data/plansDeCompte/plan-de-compte-${norme}-${sousNorme}-${année}.xml`
}

export default function(store){

    return {
        onNewDocumentBudgetaireText(fileText){
            const docBudgP = Promise.resolve()
            .then(() => (new DOMParser()).parseFromString(fileText, "text/xml"))
            .then(xmlDocumentToDocumentBudgetaire);
            
            store.mutations.documentBudgetaires.add.setPending(docBudgP)

            docBudgP
            .then(docBudg => {
                store.mutations.documentBudgetaires.add.setValue(docBudgP, docBudg)
            })

            docBudgP.catch(err => store.mutations.documentBudgetaires.add.setError(docBudgP, err))

            docBudgP
            .then(docBudg => {
                const planDeCompteURL = makePlanDeCompteURL(docBudg);

                const planDeCompteP = xml(planDeCompteURL)
                .then(fromXMLDocument)
                .then(planDeCompte => store.mutations.documentBudgetaires.planDeCompte.setValue(docBudg, planDeCompte))

                store.mutations.documentBudgetaires.planDeCompte.setPending(docBudg, planDeCompteP)

                planDeCompteP.catch(err => {
                    store.mutations.documentBudgetaires.planDeCompte.setError(
                        docBudg, 
                        Object.assign(
                            err,
                            {url: planDeCompteURL}
                        )
                    )
                })
            })
        },

        importAggregationDescription: store.mutations.aggregationDescription.set
    }

}