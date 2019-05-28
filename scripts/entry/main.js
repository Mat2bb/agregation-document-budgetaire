import {h, render} from 'preact'
import {csv, xml, text} from 'd3-fetch';

import xmlDocumentToDocumentBudgetaire from '../finance/xmlDocumentToDocumentBudgetaire.js'
import makeNatureToChapitreFI from '../finance/makeNatureToChapitreFI.js'
import _actions from '../actions'

import Main from '../components/Main.js'

import store from '../store.js'

import { getStoredState, saveState } from '../stateStorage.js'

//import montreuilCVSToAggregationFormulas from '../montreuilCVSToAggregationFormulas.js'

const actions =_actions(store);

// initialize store
store.mutations.aggregationDescription.set({
	id: 'racine',
	name: 'racine',
	children: Object.create(null)
})


const isMontreuil = new Set((new URLSearchParams(location.search)).keys()).has('montreuil')

if(isMontreuil){
	// Download and transform some Compte Administratif for easier use
	const docBudgP = Promise.all([
		xml('./data/CA/CA 2017.xml'),
		xml('./data/plansDeCompte/plan-de-compte-M14-M14_COM_SUP3500-2017.xml')
			.then(pdC => makeNatureToChapitreFI([pdC]))
	])
	.then(([doc, natureToChapitreFI]) => xmlDocumentToDocumentBudgetaire(doc, natureToChapitreFI))
	.then(docBudg => {
		console.log('docBudg', docBudg)
		store.mutations.testedDocumentBudgetaire.setValue(docBudg)
		return docBudg
	})
	.catch(console.error)


	// Download Montreuil "Open data nomenclature" CSV and transform it to formulas
	Promise.all([
		csv('./data/agregation-Montreuil-v4.csv'),
		docBudgP
	])
	.then(([csvData, docBudg]) => montreuilCVSToAggregationFormulas(csvData, [docBudg]))
	.then(formulas => {
		console.log('formulas', formulas)

		for(const {name, formula} of formulas){
			store.mutations.addFormula({ id: name, name, formula })
		}
	})
}
else{
	// Download and transform some Compte Administratif
	text('./data/CA/CA2017BPAL.xml')
		.then(actions.onNewDocumentBudgetaireText)
		.catch(console.error)

	// load stored aggregation description
	const storedAggregationDescription = getStoredState()

	if(storedAggregationDescription){
		console.log('storedAggregationDescription', storedAggregationDescription)
		store.mutations.aggregationDescription.set(storedAggregationDescription)
	}

}

// UI render
const container = document.querySelector('#react-content')

function renderUI(){
	render(
		html`<${Main} store=${ {...store} }/>`,
		container,
		container.firstElementChild
	);
}

// initial render
renderUI()

// render when state changes
store.subscribe(renderUI)

// Save state regularly
store.subscribe(saveState)