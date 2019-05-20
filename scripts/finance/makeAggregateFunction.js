import memoize from 'fast-memoize'

import {AggregatedDocumentBudgetaire, AggregatedDocumentBudgetaireLeaf} from './AggregationDataStructures.js'
import makeLigneBudgetFilterFromFormula from '../DocumentBudgetaireQueryLanguage/makeLigneBudgetFilterFromFormula.js'

export default memoize(function makeAggregateFunction(aggregationDescription, planDeCompte){

    const aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode = memoize(function(aggregationDescriptionNode, documentBudgetaire, planDeCompte){
        const {id, name, children, formula} = aggregationDescriptionNode;

        return children ?
            // non-leaf
            AggregatedDocumentBudgetaire({
                id, name, 
                children: children.map(n => aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(n, documentBudgetaire, planDeCompte))
            }) :
            // leaf, has .formula
            AggregatedDocumentBudgetaireLeaf({
                id, name, 
                elements: documentBudgetaire.rows.filter(makeLigneBudgetFilterFromFormula(formula, planDeCompte))
            })
    });

    return memoize(function aggregate(docBudg){
        return aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(aggregationDescription, docBudg, planDeCompte)
    })
})