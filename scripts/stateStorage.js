
// Right now, what needs to be saved is a set of formulas which is represented in the store
// as a Map<id, {id, name, formula}>

// In a near future, what will be built will be an AggregationDescription
// So a different storage will need to be created and a transition path will need to be 
// figured out to prevent data loss for those using the application in the current state
// and saving formula sets in localStorage


const FORMULA_STORAGE_KEY = 'formulas-set';


export function getStoredState(){
    return JSON.parse(localStorage.getItem(FORMULA_STORAGE_KEY) || '[]')
}

export function saveState(state){
    //localStorage.setItem(FORMULA_STORAGE_KEY, JSON.stringify([...state.formulas.values()]))
}
