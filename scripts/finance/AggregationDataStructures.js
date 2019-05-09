import { Record, Set as ImmutableSet, OrderedMap } from 'immutable';
import { sum } from 'd3-array';

import memoize from 'fast-memoize'

/*

    An AggregationDescription is a tree-shaped data structure that describes an aggregation
    The leaves contain a "formula" which acts like a filter on a DocumentBudgetaire

interface AggregationDescription extends AggregationDescriptionNode, Readonly<{
    children: OrderedMap<id, AggregationDescription | AggregationDescriptionLeaf>
}>{}

interface AggregationDescriptionNode extends Readonly<{
    id: string,
    label: string
}>{}

interface AggregationDescriptionLeaf extends AggregationDescriptionNode, Readonly<{
    formula: string
}>{}

*/

const AggregationDescriptionNodeFields = {
    'id': undefined,
    'name': undefined,
}

export const AggregationDescriptionLeaf = Record({
    formula: undefined,
    ...AggregationDescriptionNodeFields
})

export const AggregationDescription = Record({
    children: undefined,
    ...AggregationDescriptionNodeFields
})

export function AggregationDescriptionToJSON(aggregationDescription){
    const {id, name, formula, children} = aggregationDescription

    return children ?
        { id, name, children : children.valueSeq().toArray().map(AggregationDescriptionToJSON) } :
        { id, name, formula } ;
}

export function AggregationDescriptionFromJSON(aggregationDescriptionJSON){
    const {id, name, formula, children} = aggregationDescriptionJSON

    return children ?
        AggregationDescription(
            { id, name, children: OrderedMap(children.map(c => [c.id, AggregationDescriptionFromJSON(c)])) }
        ) :
        AggregationDescriptionLeaf({ id, name, formula }) ;
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
    elements: ImmutableSet<LigneBudget>
}>{}



interface AggregateMaker {
    (desc: AggregationDescription): 
        (doc: DocumentBudgetaire) => AggregatedDocumentBudgetaire;
}

*/

const AggregatedDocumentBudgetaireNodeFields = {
    'id': undefined,
    'name': undefined,
}

export const AggregatedDocumentBudgetaireLeaf = Record({
    elements: undefined,
    ...AggregatedDocumentBudgetaireNodeFields
})

export const AggregatedDocumentBudgetaire = Record({
    children: undefined,
    ...AggregatedDocumentBudgetaireNodeFields
})

export function getAggregatedDocumentBudgetaireLeaves(aggregatedDocumentBudgetaire){
    return aggregatedDocumentBudgetaire.children ?
        aggregatedDocumentBudgetaire.children.valueSeq().map(getAggregatedDocumentBudgetaireLeaves).flatten() :
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
        return ImmutableSet.union(node.children.map(aggregatedDocumentBudgetaireNodeElements))
    }
}

export const aggregatedDocumentBudgetaireNodeElements = memoize(rawAggregatedDocumentBudgetaireNodeElements)

/*
    Function to compute the LigneBudget elements total of a given node in the AggregatedDocumentBudgetaire tree
*/

function rawAggregatedDocumentBudgetaireNodeTotal(node){
    // .toArray is carefully placed so the result stops being a Set *before* the .map
    // if the .map was done before the .toArray, similar amounts would be counted only once leading
    // to an incorrect sum
    return sum(aggregatedDocumentBudgetaireNodeElements(node).toArray().map(row => row['MtReal']))
}

export const aggregatedDocumentBudgetaireNodeTotal = memoize(rawAggregatedDocumentBudgetaireNodeTotal)