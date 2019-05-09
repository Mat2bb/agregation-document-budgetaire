import {AggregationDescriptionToJSON, AggregationDescriptionFromJSON} from './finance/AggregationDataStructures.js'

const AGGREGATION_DESCRIPTION_KEY = 'aggregation-description';

export function getStoredState(){
    const stored = localStorage.getItem(AGGREGATION_DESCRIPTION_KEY) || undefined;

    return stored && AggregationDescriptionFromJSON(JSON.parse(stored))
}

export function saveState(state){
    localStorage.setItem(
        AGGREGATION_DESCRIPTION_KEY, 
        JSON.stringify( AggregationDescriptionToJSON(state.aggregationDescription) ) 
    )
}
