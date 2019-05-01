import { OrderedMap, List } from 'immutable';

import Store from 'baredux'

import {AggregationDescription, AggregationDescriptionLeaf} from './finance/AggregationDataStructure.js'
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

                // this changes all objects in the path, of which aggregationDescriptionNodeToKeyPath does not have the keypaths now
                state.aggregationDescription = state.aggregationDescription.setIn(nodeKeyPath, newNode)
                fillAggregationDescriptionNodeToKeyPath(state.aggregationDescription)
            },
            selectNode(state, nodeId, index){
                state.millerColumnSelection = state.millerColumnSelection.slice(0, index).push(nodeId)
            }
        },
        testedDocumentBudgetaire: makeAsyncMutationFunctions('testedDocumentBudgetaire')
    }
})
