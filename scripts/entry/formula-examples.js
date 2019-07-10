import FormulaExamples from '../formula-examples/FormulaExamples.svelte'
import memoize from '../memoize.js'
import { sum } from 'd3-array';
import { xml } from 'd3-fetch';

import xmlDocumentToDocumentBudgetaire from '../finance/xmlDocumentToDocumentBudgetaire.js'
import makeLigneBudgetFilterFromFormula from '../DocumentBudgetaireQueryLanguage/makeLigneBudgetFilterFromFormula.js'
import {fromXMLDocument} from '../finance/planDeCompte.js'


const planDeCompteP = xml('./data/plansDeCompte/plan-de-compte-M52-M52-2017.xml')
.then(fromXMLDocument)

const docBudgP = xml('./data/CA/gironde/CA2017BPAL.xml')
.then(xmlDocumentToDocumentBudgetaire)
.catch(console.error)

const examples = [
    {
        formula: 'D',
        description: 'toutes les dépenses'
    },
    {
        formula: 'R',
        description: 'toutes les recettes'
    },
    {
        formula: 'RI',
        description: `toutes les recettes d'investissement`
    },
    {
        formula: 'DF',
        description: 'toutes les dépenses de fonctionnement'
    },
    {
        formula: 'DF∩F4',
        description: 'toutes les dépenses de fonctionnement de la fonction 4'
    },
    {
        formula: 'DF∩(F4 ∪ F5)',
        description: 'toutes les dépenses de fonctionnement des fonctions 4 et 5'
    },
    {
        formula: 'DF∩(C64111 ∪ C6451)',
        description: 'toutes les dépenses de fonctionnement des natures 64111 et 6451 (salaire + URSSAF)'
    },
    {
        formula: 'DF∩(C64111 ∪ C6451)∩F52',
        description: 'toutes les dépenses de fonctionnement salaires+URSSAF lié à la fonction 52 (Personnes handicapées)'
    },
    {
        formula: 'DF∩((F50∩(C64121 ∪ C64126)) ∪ (F51 - C6526))',
        description: 'Gironde - social - enfance'
    },
    {
        formula: 'RI∩Ch16',
        description: `toutes les recettes d'investissement du chapitre 16 (emprunts)`
    },
    {
        formula: 'RF∩(C7478141 ∪ C7478142 ∪ C74788∩F53∩Ann2016)',
        description: `Gironde - recettes de fonctionnement - Conférence des financeurs`
    },
    {
        formula: 'DF∩C60 - (F4∪F5∪F8∪F621)',
        description: `Gironde - dépense de fonctionnement - Achats et fournitures`
    }
];

const getFormulaLignes = memoize((formula, docBudg, planDeCompte) => {
    return [...docBudg['rows']].filter(makeLigneBudgetFilterFromFormula(formula, planDeCompte))
})

docBudgP
.then(docBudg => console.log('docBudg', docBudg))


const state = {
    formula: decodeURIComponent(location.hash.slice(1)) || '',
    planDeCompte: undefined,
    lignes: undefined,
    examples
}

document.addEventListener('DOMContentLoaded', e => {

    let changeHashTimeout;

    const formulaExamplesUI = new FormulaExamples({
        target: document.body.querySelector('main'),
        props: state
    });

    Promise.all([ docBudgP, planDeCompteP ])
    .then(([docBudg, planDeCompte]) => {

        state.lignes = getFormulaLignes(state.formula, docBudg, planDeCompte)
        state.planDeCompte = planDeCompte

        formulaExamplesUI.$set(Object.assign({}, state))

        formulaExamplesUI.$on('formula-change', formula => {
            state.formula = formula
            state.lignes = getFormulaLignes(formula, docBudg, planDeCompte)

            // save in hash if formula stayed unchanged for 3secs
            clearTimeout(changeHashTimeout)
            changeHashTimeout = setTimeout(() => {
                location.hash = encodeURIComponent(formula)
                changeHashTimeout = undefined;
            }, 3000)
        })
        
        window.addEventListener('hashchange', () => {
            const hashValue = decodeURIComponent(location.hash.slice(1).trim());
    
    
            if(hashValue && state.formula !== hashValue){
                state.formula = hashValue
                state.lignes = getFormulaLignes(hashValue, docBudg, planDeCompte)
                formulaExamplesUI.$set(Object.assign({}, state))
            }
        })

    })

    // empty input (sometimes filled with pre-refresh value)
    
    // initialize input vith hash value
    //Promise.all([ docBudgP, planDeCompteP ]).then(hashUpdate)

    
    


}, { once: true })
