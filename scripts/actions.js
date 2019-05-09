import {xml} from 'd3-fetch'

import makeNatureToChapitreFI from './finance/makeNatureToChapitreFI.js'
import xmlDocumentToDocumentBudgetaire from './finance/xmlDocumentToDocumentBudgetaire.js'

function makePlanDeCompteURL(docBudg){
    const [norme, sousNorme] = docBudg.querySelector('EnTeteBudget Nomenclature').getAttribute('V').split('-');
    const année = docBudg.querySelector('BlocBudget Exer').getAttribute('V')

    return `https://dtc-innovation.github.io/plans-de-compte/${année}/${norme}/${sousNorme}/planDeCompte.xml`
}

export default function(store){

    return {
        onNewDocumentBudgetaireText(fileText){
            Promise.resolve()
            .then(() => (new DOMParser()).parseFromString(fileText, "text/xml"))
            .then(docBudg => {
                xml(makePlanDeCompteURL(docBudg))
                .then(planDeCompte => makeNatureToChapitreFI([planDeCompte]))
                .then(natureToChapitreFI => xmlDocumentToDocumentBudgetaire(docBudg, natureToChapitreFI))
                .then(store.mutations.testedDocumentBudgetaire.setValue)
                .catch(store.mutations.testedDocumentBudgetaire.setError) 
            })
        },
        importAggregationDescription: store.mutations.aggregationDescription.set
    }

}