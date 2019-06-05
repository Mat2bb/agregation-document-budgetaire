import Store from 'baredux'
import produce, {original} from 'immer'

import {ASYNC_STATUS, STATUS_PENDING, STATUS_ERROR, STATUS_VALUE} from './asyncStatusHelpers.js'


export default new Store({
    state: {
        millerColumnSelection: [],
        aggregationDescription: undefined,
        selectedDocumentBudgetaireWithPlanDeCompte: undefined,
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
                setPending(state, pendingValue){

                    return produce(state, draft => {
                        pendingValue[ASYNC_STATUS] = STATUS_PENDING;

                        draft.documentBudgetairesWithPlanDeCompte.push({
                            documentBudgetaire: pendingValue
                        })
                    })
                },
                setError(state, pendingValue, error){
                    return produce(state, draft => {
                        error[ASYNC_STATUS] = STATUS_ERROR;
                        const index = draft.documentBudgetairesWithPlanDeCompte.findIndex(({documentBudgetaire}) => documentBudgetaire === pendingValue)
                        draft.documentBudgetairesWithPlanDeCompte[index] = {
                            documentBudgetaire: error
                        }
                    })
                },
                setValue(state, pendingValue, value){
                    value[ASYNC_STATUS] = STATUS_VALUE;

                    return produce(state, draft => {
                        const index = draft.documentBudgetairesWithPlanDeCompte.findIndex(({documentBudgetaire}) => documentBudgetaire === pendingValue)
                        draft.documentBudgetairesWithPlanDeCompte[index] = {
                            documentBudgetaire: value
                        }
    
                        draft.documentBudgetairesWithPlanDeCompte = draft.documentBudgetairesWithPlanDeCompte.sort((dbwpc1, dbwpc2) => {
                            const {documentBudgetaire: {Exer: Exer1}} = dbwpc1
                            const {documentBudgetaire: {Exer: Exer2}} = dbwpc2
    
                            return Exer2 - Exer1 
                        })

                        draft.selectedDocumentBudgetaireWithPlanDeCompte = draft.documentBudgetairesWithPlanDeCompte[0]
                    })
                    
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
                setValue(state, docBudg, planDeCompte){
                    planDeCompte[ASYNC_STATUS] = STATUS_VALUE;
                    
                    const dbwpdc = state.documentBudgetairesWithPlanDeCompte.find(
                        ({documentBudgetaire}) => documentBudgetaire === docBudg
                    )
                    
                    dbwpdc.planDeCompte = planDeCompte;
                }
            }
        },
        selectedDocumentBudgetaireWithPlanDeCompte: {
            set(state, dbwpc){
                return produce(state, draft => {
                    draft.selectedDocumentBudgetaireWithPlanDeCompte = dbwpc
                })
            }
        }
    }
})
