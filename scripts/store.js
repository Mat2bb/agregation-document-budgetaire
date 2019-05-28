import Store from 'baredux'
import produce, {original} from 'immer'

import {ASYNC_STATUS, STATUS_PENDING, STATUS_ERROR, STATUS_VALUE} from './asyncStatusHelpers.js'


export default new Store({
    state: {
        millerColumnSelection: [],
        aggregationDescription: undefined,
        testedDocumentBudgetaireWithPlanDeCompte: undefined,
        documentBudgetairesWithPlanDeCompte: []
    },
    mutations: {
        aggregationDescription: {
            set(state, aggregationDescription){
                return produce(state, draft => {
                    draft.aggregationDescription = aggregationDescription
                    draft.millerColumnSelection = []
                })
            },
            addChild(state, child){
                // add child to only root
                return produce(state, draft => {
                    draft.aggregationDescription.children[child.id] = child
                    
                    // select newly created node
                    draft.millerColumnSelection = [ child.id ]
                })
            },
            editChild(state, previousChild, newChild, newSelectedList){
                // edit child at only root
                //console.log('editChild root', previousChild, newChild, newSelectedList)

                return produce(state, draft => {
                    const {id: newId} = newChild;
                    const {id: previousId} = previousChild;

                    if(previousId !== newId){
                        delete draft.aggregationDescription.children[previousId];

                        draft.millerColumnSelection[draft.millerColumnSelection.findIndex(id => id === previousId)] = newId
                    }

                    draft.aggregationDescription.children[newId] = newChild

                    if(newSelectedList)
                        draft.millerColumnSelection = [newChild.id, ...newSelectedList];
                })

            },
            removeChild(state, child){
                // add child to only root
                return produce(state, draft => {
                    delete draft.aggregationDescription.children[child.id]
                    
                    // select newly created node
                    draft.millerColumnSelection = [];
                })
            }
        },
        millerColumnSelection: {
            set(state, newSelection){
                return produce(state, draft => {
                    draft.millerColumnSelection = newSelection;
                })
            }
        },
        documentBudgetaires: {
            add: {
                setPending(state, i, pendingValue){
                    pendingValue[ASYNC_STATUS] = STATUS_PENDING;
                    state.documentBudgetairesWithPlanDeCompte[i] = {
                        documentBudgetaire: pendingValue
                    }
                },
                setError(state, i, error){
                    error[ASYNC_STATUS] = STATUS_ERROR;
                    state.documentBudgetairesWithPlanDeCompte[i] = {
                        documentBudgetaire: error
                    }
                },
                setValue(state, i, value){
                    value[ASYNC_STATUS] = STATUS_VALUE;
                    state.documentBudgetairesWithPlanDeCompte[i] = {
                        documentBudgetaire: value
                    }
                }
            },
            planDeCompte: {
                setPending(state, docBudg, pendingValue){
                    pendingValue[ASYNC_STATUS] = STATUS_PENDING;
                    const dbwpdc = state.documentBudgetairesWithPlanDeCompte.find(
                        ({documentBudgetaire}) => documentBudgetaire === docBudg
                    )
                    
                    dbwpdc.planDeCompte = pendingValue;
                },
                setError(state, docBudg, error){
                    error[ASYNC_STATUS] = STATUS_ERROR;
                    
                    const dbwpdc = state.documentBudgetairesWithPlanDeCompte.find(
                        ({documentBudgetaire}) => documentBudgetaire === docBudg
                    )
                    
                    dbwpdc.planDeCompte = error;
                },
                setValue(state, docBudg, value){
                    value[ASYNC_STATUS] = STATUS_VALUE;
                    
                    const dbwpdc = state.documentBudgetairesWithPlanDeCompte.find(
                        ({documentBudgetaire}) => documentBudgetaire === docBudg
                    )
                    
                    dbwpdc.planDeCompte = value;
                }
            }
        },
        testedDocumentBudgetaireWithPlanDeCompte: {
            set(state, docBudg){
                return produce(state, draft => {
                    draft.testedDocumentBudgetaireWithPlanDeCompte = draft.documentBudgetairesWithPlanDeCompte.find(
                        ({documentBudgetaire}) => original(documentBudgetaire) === docBudg
                    )
                })
            }
        }
    }
})
