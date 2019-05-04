import Bouture from 'https://cdn.jsdelivr.net/gh/DavidBruant/bouture@13cb6c683fa87e5feea574311dcda6353489bb3b/bouture.js'
import memoize from 'fast-memoize'
import { sum } from 'd3-array';
import { xml } from 'd3-fetch';

import makeNatureToChapitreFI from '../finance/makeNatureToChapitreFI.js'
import xmlDocumentToDocumentBudgetaire from '../finance/xmlDocumentToDocumentBudgetaire.js'


function makeFilterFromParserOutput(parserOutput) {

    function matchesSimple(r, subset) {
        switch (subset) {
            case 'R':
            case 'D':
                return r['CodRD'] === subset;
            case 'F':
            case 'I':
                return r['FI'] === subset;
            case 'RF':
            case 'RI':
            case 'DF':
            case 'DI':
                return r['CodRD'] === subset[0] && r['FI'] === subset[1];
        }

        if (subset.startsWith('N'))
            return subset.slice(1) === r['Nature']

        if (subset.startsWith('F'))
            return r['Fonction'].startsWith(subset.slice(1))

        if (subset.startsWith('C'))
            return subset.slice(1) === r['Chapitre']

        console.warn('matchesSubset - Unhandled case', subset);
    }


    function matchesComplex(r, combo) {
        if (typeof combo === 'string')
            return matchesSimple(r, combo);

        // Array.isArray(combo)
        const [left, middle, right] = combo;

        if (left === '(' && right === ')')
            return matchesComplex(r, middle)
        else {
            const operator = middle;

            switch (operator) {
                case '+':
                    return matchesComplex(r, left) || matchesComplex(r, right)
                case '*':
                    return matchesComplex(r, left) && matchesComplex(r, right)
                case '-':
                    return matchesComplex(r, left) && !matchesComplex(r, right)
                default:
                    console.warn('matchesSubset - Unhandled case', operator, combo);
            }
        }

        console.warn('matchesSubset - Unhandled case', combo);
    }


    return function (r) {
        return matchesComplex(r, parserOutput[0])
    }

}

function makeTable(rows, year) {
    return Bouture.section([
        Bouture.h1('CA Gironde ', year),
        Bouture.h2(rows.length, ' elements | ', sum(rows.map(r => r['MtReal'])).toFixed(2) + '€'),
        Bouture.table([
            Bouture.thead.tr(['RD', 'FI', 'Fonction', 'Nature', 'Montant'].map(t => Bouture.th(t))),
            Bouture.tbody(
                rows.map(r => {
                    console.log('r', r.toJS())

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

        function makeOutputFromFormula(formula) {
            const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

            parser.feed(formula);

            const filter = makeFilterFromParserOutput(parser.results);

            return Bouture.output(
                [ makeTable(docBudg['rows'].filter(filter), docBudg['Exer']) ]
            ).getElement()
        }

        const memzMakeOutputFromFormula = memoize(makeOutputFromFormula)

        let changeHashTimeout;

        input.addEventListener('input', e => {
            const formula = e.target.value.trim();

            console.log()

            document.body.querySelector('output').replaceWith(
                memzMakeOutputFromFormula(formula)
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
            formula: 'DF*F4',
            description: 'toutes les dépenses de fonctionnement de la fonction 4'
        },
        {
            formula: 'DF*(F4+F5)',
            description: 'toutes les dépenses de fonctionnement des fonctions 4 et 5'
        },
        {
            formula: 'DF*(N64111+N6451)',
            description: 'toutes les dépenses de fonctionnement des natures 64111 et 6451 (salaire + URSSAF)'
        },
        {
            formula: 'DF*(N64111+N6451)*F52',
            description: 'toutes les dépenses de fonctionnement salaires+URSSAF lié à la fonction 52 (Personnes handicapées)'
        },
        {
            formula: 'RI*C16',
            description: `toutes les recettes d'investissement du chapitre 16 (emprunts)`
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