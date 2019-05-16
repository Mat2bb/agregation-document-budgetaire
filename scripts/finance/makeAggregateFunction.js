import {AggregatedDocumentBudgetaire, AggregatedDocumentBudgetaireLeaf} from './AggregationDataStructures.js'
import makeLigneBudgetFilterFromFormula from '../DocumentBudgetaireQueryLanguage/makeLigneBudgetFilterFromFormula.js'

export default function makeAggregateFunction(aggregationDescription){

    function aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(aggregationDescriptionNode, documentBudgetaire){
        const {id, name, children, formula} = aggregationDescriptionNode;

        return children ?
            // non-leaf
            AggregatedDocumentBudgetaire({
                id, name, 
                children: children.map(n => aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(n, documentBudgetaire))
            }) :
            // leaf, has .formula
            AggregatedDocumentBudgetaireLeaf({
                id, name, 
                elements: documentBudgetaire.rows.filter(makeLigneBudgetFilterFromFormula(formula, documentBudgetaire.Exer))
            })
    }

    return function aggregate(docBudg){
        return aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(aggregationDescription, docBudg)
    }
}