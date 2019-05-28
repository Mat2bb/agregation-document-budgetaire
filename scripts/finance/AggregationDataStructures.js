import { sum } from 'd3-array';

import memoize from '../memoize.js'

/*

    An AggregationDescription is a tree-shaped data structure that describes an aggregation
    The leaves contain a "formula" which acts like a filter on a DocumentBudgetaire

interface AggregationDescription extends AggregationDescriptionNode, Readonly<{
    children: Map<id, AggregationDescription | AggregationDescriptionLeaf>
}>{}

interface AggregationDescriptionNode extends Readonly<{
    id: string,
    label: string
}>{}

interface AggregationDescriptionLeaf extends AggregationDescriptionNode, Readonly<{
    formula: string
}>{}

*/

export function AggregationDescriptionToJSON(aggregationDescription){
    const {id, name, formula, children} = aggregationDescription

    return children ?
        { id, name, children : Object.values(children).map(AggregationDescriptionToJSON) } :
        { id, name, formula } ;
}

export function AggregationDescriptionFromJSON(aggregationDescriptionJSON){
    const {id, name, formula, children} = aggregationDescriptionJSON

    return children ?
        { id, name, children: Object.fromEntries(children.map(c => [c.id, AggregationDescriptionFromJSON(c)])) } :
        { id, name, formula } ;
}


/*
    An AggregatedDocumentBudgetaire is the result of an AggregationDescription applied to a DocumentBudgetaire
    It's a tree-shaped data structures that mirrors the AggregationDescription structure

interface AggregatedDocumentBudgetaire extends AggregationDocumentBudgetaireNode, Readonly<{
    children: OrderedSet<AggregatedDocumentBudgetaire | AggregatedDocumentBudgetaireLeaf>
}>{}

interface AggregationDocumentBudgetaireNode extends Readonly<{
    id: string,
    label: string
}>{}

interface AggregatedDocumentBudgetaireLeaf extends AggregationDocumentBudgetaireNode, Readonly<{
    elements: Set<LigneBudget>
}>{}



interface AggregateMaker {
    (desc: AggregationDescription): 
        (doc: DocumentBudgetaire) => AggregatedDocumentBudgetaire;
}

*/

export function getAggregatedDocumentBudgetaireLeaves(aggregatedDocumentBudgetaire){
    return aggregatedDocumentBudgetaire.children ?
        Object.values(aggregatedDocumentBudgetaire.children).map(getAggregatedDocumentBudgetaireLeaves).flat() :
        aggregatedDocumentBudgetaire
}

/*
    Function to compute the LigneBudget elements of a given node in the AggregatedDocumentBudgetaire tree
    by making the union of children, recursively
*/

function rawAggregatedDocumentBudgetaireNodeElements(node){
    if(!node.children)
        return node.elements
    else{
        const union = new Set()
    
        for(const child of node.children){
            for(const el of aggregatedDocumentBudgetaireNodeElements(child)){
                union.add(el);
            }
        }

        return union
    }
}

export const aggregatedDocumentBudgetaireNodeElements = memoize(rawAggregatedDocumentBudgetaireNodeElements)

/*
    Function to compute the LigneBudget elements total of a given node in the AggregatedDocumentBudgetaire tree
*/


function rawAggregatedDocumentBudgetaireNodeTotal(node){
    // [...arr] is carefully placed so the result stops being a Set *before* the .map
    // if the .map was done before the [...arr], similar amounts would be counted only once leading
    // to an incorrect sum
    
    return sum([...aggregatedDocumentBudgetaireNodeElements(node)].map(row => row['MtReal']))
}

export const aggregatedDocumentBudgetaireNodeTotal = memoize(rawAggregatedDocumentBudgetaireNodeTotal)