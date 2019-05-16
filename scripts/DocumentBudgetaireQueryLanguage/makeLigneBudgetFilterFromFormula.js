import nearley from 'nearley';
import memoize from 'fast-memoize'

import grammar from './grammar.js'

function matchesSimple(r, year, subset) {

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
    if (subset.startsWith('Ann'))
        return subset.slice('Ann'.length) === String(year)

    console.warn('matchesSubset - Unhandled case', subset);
}

function matchesComplex(r, year, combo) {

    if (typeof combo === 'string')
        return matchesSimple(r, year, combo);
    
    // assert(Array.isArray(combo))

    const [left, middle, right] = combo;
    
    if (left === '(' && right === ')')
        return matchesComplex(r, year, middle)
    else {
        const operator = middle;
    
        switch (operator) {
            case '+':
            case '∪':
                return matchesComplex(r, year, left) || matchesComplex(r, year, right)
            case '∩':
                return matchesComplex(r, year, left) && matchesComplex(r, year, right)
            case '-':
                return matchesComplex(r, year, left) && !matchesComplex(r, year, right)
            default:
                console.warn('matchesSubset - Unhandled case', operator, combo);
        }
    }
    
    console.warn('matchesSubset - Unhandled case', combo);
}

const returnFalseFunction = Object.freeze(() => false);

/*
    returns a function that can be used in the context of a documentBudgetaire.rows.filter()
*/
export default memoize(function makeLigneBudgetFilterFromFormula(formula, year) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    try{
        parser.feed(formula);

        if(parser.results[0] === undefined)
            return returnFalseFunction
        else
            return memoize(budgetRow => matchesComplex(budgetRow, year, parser.results[0]))
    }
    catch(e){
        return returnFalseFunction
    }
})
