import Bouture from 'https://cdn.jsdelivr.net/gh/DavidBruant/bouture@13cb6c683fa87e5feea574311dcda6353489bb3b/bouture.js'
import memoize from 'fast-memoize'
import { sum } from 'd3-array';
import { xml } from 'd3-fetch';

import makeNatureToChapitreFI from '../finance/makeNatureToChapitreFI.js'
import xmlDocumentToDocumentBudgetaire from '../finance/xmlDocumentToDocumentBudgetaire.js'
import makeLigneBudgetFilterFromFormula from '../DocumentBudgetaireQueryLanguage/makeLigneBudgetFilterFromFormula.js'


function makeTable(rows, year) {
    return Bouture.section([
        Bouture.h1('CA Gironde ', year),
        Bouture.h2(rows.size, ' elements | ', sum(rows.map(r => r['MtReal'])).toFixed(2) + '€'),
        Bouture.table([
            Bouture.thead.tr(['RD', 'FI', 'Fonction', 'Nature', 'Montant'].map(t => Bouture.th(t))),
            Bouture.tbody(
                rows.map(r => {
                    return Bouture.tr([
                        Bouture.td(r['CodRD']),
                        Bouture.td(r['FI']),
                        Bouture.td(r['Fonction']),
                        Bouture.td(r['Nature']),
                        Bouture.td(r['MtReal'].toFixed(2) + '€')
                    ])
                }).toArray()
            )
        ])
    ])
}


const docBudgP = Promise.all([
    xml('./data/CA/CA2017BPAL.xml'),
    xml('./data/plansDeCompte/plan-de-compte-M52-M52-2017.xml')
        .then(pdC => makeNatureToChapitreFI([pdC]))
])
    .then(([doc, natureToChapitreFI]) => xmlDocumentToDocumentBudgetaire(doc, natureToChapitreFI))
    .then(docBudg => {
        console.log('docBudg', docBudg.toJS())
        return docBudg
    })
    .catch(console.error)

document.addEventListener('DOMContentLoaded', e => {
    const input = document.body.querySelector('input');

    docBudgP.then(docBudg => {

        function makeOutputFromFormula(formula, year) {
            const filter = makeLigneBudgetFilterFromFormula(formula, year)

            return Bouture.output(
                [ makeTable(docBudg['rows'].filter(filter), docBudg['Exer']) ]
            ).getElement()
        }

        const memzMakeOutputFromFormula = memoize(makeOutputFromFormula)

        let changeHashTimeout;

        input.addEventListener('input', e => {
            const formula = e.target.value.trim();

            document.body.querySelector('output').replaceWith(
                memzMakeOutputFromFormula(formula, docBudg.Exer)
            )

            // save in hash if formula stayed unchanged for 3secs
            clearTimeout(changeHashTimeout)
            changeHashTimeout = setTimeout(() => {
                location.hash = encodeURIComponent(formula)
            }, 3000)

        })
    })

    function hashUpdate() {
        const hashValue = decodeURIComponent(location.hash.slice(1));

        if (hashValue && hashValue !== input.value) {
            input.value = hashValue;
            input.dispatchEvent(new Event('input'))
        }
    }

    // empty input (sometimes filled with pre-refresh value)
    input.value = "";
    input.focus()

    // initialize input vith hash value
    docBudgP.then(hashUpdate)

    window.addEventListener('hashchange', hashUpdate)


    // Create examples list
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
            formula: 'DF∩(N64111 ∪ N6451)',
            description: 'toutes les dépenses de fonctionnement des natures 64111 et 6451 (salaire + URSSAF)'
        },
        {
            formula: 'DF∩(N64111 ∪ N6451)∩F52',
            description: 'toutes les dépenses de fonctionnement salaires+URSSAF lié à la fonction 52 (Personnes handicapées)'
        },
        {
            formula: 'DF∩((F50∩(N64121 ∪ N64126)) ∪ (F51 - F51∩N6526))',
            description: 'Gironde - social - enfance'
        },
        {
            formula: 'RI∩C16',
            description: `toutes les recettes d'investissement du chapitre 16 (emprunts)`
        },
        {
            formula: 'RF∩(N7478141 ∪ N7478142 ∪ N74788∩F53∩Ann2016)',
            description: `Gironde - recettes de fonctionnement - Conférence des financeurs`
        }
    ];

    const ul = Bouture.ul(examples.map(({ formula, description }) => {
        return Bouture.li([
            Bouture.a({ href: `#${encodeURIComponent(formula)}` }).code(formula),
            Bouture.span(` : ${description}`)
        ])
    })).getElement();

    document.body.querySelector('ul.examples').replaceWith(ul)

}, { once: true })