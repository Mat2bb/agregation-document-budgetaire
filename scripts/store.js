import { OrderedMap, List } from 'immutable';

import Store from 'baredux'

import {AggregationDescription, AggregationDescriptionLeaf} from './finance/AggregationDataStructures.js'
import {makeAsyncMutationFunctions} from './asyncStatusHelpers.js'


const aggregationDescriptionNodeToKeyPath = new WeakMap()

function fillAggregationDescriptionNodeToKeyPath(aggregationDescription){
    
    const rootKeyPath = new List()

    aggregationDescriptionNodeToKeyPath.set(aggregationDescription, rootKeyPath);

    (function recursively(aggregationDescription, parentKeyPath){
        aggregationDescription.children.forEach(child => {

            if(!aggregationDescriptionNodeToKeyPath.get(child)){
                const {id, children: grandChildren} = child;

                const childKeyPath = parentKeyPath.push('children', id)
                aggregationDescriptionNodeToKeyPath.set(child, childKeyPath)

                if(grandChildren){
                    recursively(child, childKeyPath)
                }
            }
        })
    })
    (aggregationDescription, rootKeyPath)
}

export default new Store({
    state: {
        millerColumnSelection: new List(),
        aggregationDescription: undefined,
        testedDocumentBudgetaire: undefined
    },
    mutations: {
        aggregationDescription: {
            set(state, aggregationDescription){
                fillAggregationDescriptionNodeToKeyPath(aggregationDescription)

                state.aggregationDescription = aggregationDescription
            },
            addChild(state, parent, {id, name, type}){
                const newNode = type === 'subgroup' ? 
                    new AggregationDescription({id, name, children: new OrderedMap()}) :
                    new AggregationDescriptionLeaf({id, name, formula: ''})

                const parentKeyPath = aggregationDescriptionNodeToKeyPath.get(parent)
                const nodeKeyPath = parentKeyPath.push('children', id)

                aggregationDescriptionNodeToKeyPath.set(newNode, nodeKeyPath)

                state.aggregationDescription = state.aggregationDescription.setIn(nodeKeyPath, newNode)
                fillAggregationDescriptionNodeToKeyPath(state.aggregationDescription)
            },
            editChild(state, parent, currentChild, newChildData){
                const {name, type, id} = newChildData;
                const {formula, children} = currentChild;

                const parentKeyPath = aggregationDescriptionNodeToKeyPath.get(parent)
                const childKeyPath = parentKeyPath.push('children', id)

                const newNode = type === 'subgroup' ?
                    new AggregationDescription({id, name, children: children || new OrderedMap()}) :
                    new AggregationDescriptionLeaf({id, name, formula: formula || ''})

                if(currentChild.id === newChildData.id){
                    state.aggregationDescription = state.aggregationDescription.setIn(childKeyPath, newNode)
                }
                else{
                    state.aggregationDescription = state.aggregationDescription
                        .deleteIn( parentKeyPath.push('children', currentChild.id) )
                        .setIn(childKeyPath, newNode)

                    state.millerColumnSelection = state.millerColumnSelection
                        .set(
                            state.millerColumnSelection.findIndex(id => id === currentChild.id),
                            id
                        )
                }

                fillAggregationDescriptionNodeToKeyPath(state.aggregationDescription)
            },
            removeChild(state, parent, child){
                const parentKeyPath = aggregationDescriptionNodeToKeyPath.get(parent)
                const toDeletePath = parentKeyPath.push('children', child.id)

                state.millerColumnSelection = state.millerColumnSelection
                        .slice( 0, state.millerColumnSelection.findIndex(id => id === child.id) )

                state.aggregationDescription = state.aggregationDescription.deleteIn(toDeletePath)
                fillAggregationDescriptionNodeToKeyPath(state.aggregationDescription)
            },
            selectNode(state, nodeId, index){
                if(state.millerColumnSelection.get(index) === nodeId){
                    state.millerColumnSelection = state.millerColumnSelection.slice(0, index)
                }
                else{
                    state.millerColumnSelection = state.millerColumnSelection.slice(0, index).push(nodeId)
                }
            },
            changeFormula(state, node, newFormula){
                const nodeFormulaKeyPath = aggregationDescriptionNodeToKeyPath.get(node).push('formula')
                
                state.aggregationDescription = state.aggregationDescription.setIn(nodeFormulaKeyPath, newFormula)
                fillAggregationDescriptionNodeToKeyPath(state.aggregationDescription)
            }
        },
        testedDocumentBudgetaire: makeAsyncMutationFunctions('testedDocumentBudgetaire')
    }
})
