import memoize from '../memoize.js'

import makeLigneBudgetFilterFromFormula from '../DocumentBudgetaireQueryLanguage/makeLigneBudgetFilterFromFormula.js'
import getFormulaDependencies from '../DocumentBudgetaireQueryLanguage/getFormulaIdentifiers.js'

throw `TODO write automated tests, seriously`

function computeAggregationNodesInResolvableOrder(aggregationDescription){
    const aggregationDescriptionNodeToLeavesDependency = new WeakMap()

    (function recursiveAggregationDescriptionNodeToLeaves(aggregationDescriptionNode){
        const {children, formula} = aggregationDescriptionNode;

        const leafSet = formula ? 
            new Set([aggregationDescriptionNode]) : 
            new Set(Object.values(children)
                .map(recursiveAggregationDescriptionNodeToLeaves)
                .map(set => [...set])
                .flat()
            )

            aggregationDescriptionNodeToLeavesDependency.set(
                aggregationDescriptionNode, 
                leafSet
            )

        return leafSet
    })(aggregationDescription);
    
    
    function getLeaveDependencies(leaf, dependedOnMap = new Map()){
        throw `TODO create nodeById`
        const directDependencies = getFormulaDependencies(leaf.formula).map(id => nodeById.get(id))
        
        const directLeaveDependencies = new Set()
        for(const directDependency of directDependencies){
            const directDependencyLeaves = aggregationDescriptionNodeToLeavesDependency.get(directDependency)

            for(const directDependencyLeaf of directDependencyLeaves){
                directLeaveDependencies.add(directDependencyLeaf)
            }
        }

        // an direct dependency may be ancestor (which consenquently depends on leaf) 
        // This is okay, it will be interpreted as "all its children minus leaf"
        directLeaveDependencies.remove(leaf)

        // Cycle detection => early return
        for(const directLeafDependency of directLeaveDependencies){
            if(dependedOnMap.has(directLeafDependency)){
                console.warn('Cycle detected!')
                const newMap = new Map(dependedOnMap);
                newMap.set(leaf, directLeafDependency)

                return { cycle: dependedOnMap }
            }
        }


        const transitiveLeafDependenciesByLeaf = [...directLeaveDependencies].map(l => {
            const newDependedOnMap = new Map(dependedOnMap)
            newDependedOnMap.set(leaf, l)

            return getLeaveDependencies(leaf, newDependedOnMap)
        })

        const depWithCycle = transitiveLeafDependenciesByLeaf.find(deps => deps.cycle)

        if(depWithCycle){
            return depWithCycle
        }
        else{
            const transitiveLeafDependencies = new Set()

            for(const depSet of transitiveLeafDependenciesByLeaf){
                for(const dep of depSet){
                    transitiveLeafDependencies.add(dep)
                }
            }
            return transitiveLeafDependencies;
        }

    }



    let leavesDependenciesByLeaf = new Map()

    for(const descriptionLeaf of descriptionLeaves){
        const leaveDependencies = getLeaveDependencies(descriptionLeaf)
        if(leaveDependencies.cycle){
            console.warn('Cycle detected')
            return {cycle: leaveDependencies.cycle}
        }
        else{
            leavesDependenciesByLeaf.set(descriptionLeaf, leaveDependencies)
        }
        
    }

    const leavesInResolvableOrder = new Set()

    // in a worst-case inlikely scenario, this can be a quadratic algorithm
    // Per the previous step, cycles have been detected and the function returned, so no cycle here
    // so this part will finish
    while(leavesDependenciesByLeaf.size >= 1){
        for(const [leaf, dependencies] of leavesDependenciesByLeaf.entries()){
            if([...dependencies].every(d => leavesInResolvableOrder.has(d))){
                leavesInResolvableOrder.add(leaf)
                leavesDependenciesByLeaf.remove(leaf)
            }
        }
    }
    leavesDependenciesByLeaf = undefined; // this map is now empty and useless

    throw `TODO return a set of all aggregation description nodes in resolvable order`

}

export default memoize(function makeAggregateFunction(aggregationDescription, planDeCompte){

    const aggregationNodesInResolvableOrder = computeAggregationNodesInResolvableOrder(aggregationDescription)

    if(aggregationNodesInResolvableOrder.cycle){
        console.warn('makeAggregateFunction cycle detected', aggregationDescription, aggregationNodesInResolvableOrder.cycle)
        return () => {
            throw new Error(`Cannot aggregate because of cyclic dependency in aggregationDescription`, aggregationNodesInResolvableOrder.cycle)
        }
    }

    return memoize(function aggregate(documentBudgetaire){
        const identifierToLigneBudgetSet = new Map();

        const aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode = memoize(aggregationDescriptionNode => {
            const {id, name, children, formula} = aggregationDescriptionNode;
    
            return children ?
                // non-leaf
                {
                    id, name, 
                    children: Object.values(children)
                        .map(aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode)
                } :
                // leaf, has .formula
                {
                    id, name, 
                    elements: new Set(
                        [...documentBudgetaire.rows]
                            .filter(makeLigneBudgetFilterFromFormula(formula, planDeCompte, identifierToLigneBudgetSet))
                    )
                }
        });

        for(const leaf of aggregationNodesInResolvableOrder){
            aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(leaf)
        }

        return aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(aggregationDescription)
    })
})