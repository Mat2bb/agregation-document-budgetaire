import nearley from 'nearley';
import memoize from '../memoize.js'

import grammar from './grammar.js'

function matchesSimple(r, planDeCompte, token, identifierToLigneBudgetSet) {

    switch (token) {
        case 'R':
        case 'D':
            return r['CodRD'] === token;
        case 'F':
        case 'I':
            return planDeCompte.ligneBudgetFI(r) === token;
        case 'RF':
        case 'RI':
        case 'DF':
        case 'DI':
            return r['CodRD'] === token[0] && planDeCompte.ligneBudgetFI(r) === token[1];
    }

    if (token.startsWith('Ch'))
        return planDeCompte.ligneBudgetIsInChapitre(r, token.slice('Ch'.length))

    if (token.startsWith('C'))
        return planDeCompte.ligneBudgetIsInCompte(r, token.slice('C'.length))

    if (token.startsWith('F'))
        return planDeCompte.ligneBudgetIsInFonction(r, token.slice('F'.length))

    if (token.startsWith('Ann'))
        return token.slice('Ann'.length) === String(planDeCompte.Exer)

    console.log('An identifier', token)

    const ligneBudgetSet = identifierToLigneBudgetSet.get(token)

    if(ligneBudgetSet){
        return ligneBudgetSet.has(r)
    }
    else{
        console.warn('unknown identifier', token, [...identifierToLigneBudgetSet.keys()])
    }
}

function matchesComplex(r, planDeCompte, identifierToLigneBudgetSet, combo) {

    if (typeof combo === 'string')
        return matchesSimple(r, planDeCompte, combo, identifierToLigneBudgetSet);
    
    // assert(Array.isArray(combo))

    const [left, middle, right] = combo;
    
    if (left === '(' && right === ')')
        return matchesComplex(r, planDeCompte, middle)
    else {
        const operator = middle;
    
        switch (operator) {
            case '+':
            case '∪':
                return matchesComplex(r, planDeCompte, identifierToLigneBudgetSet, left) || matchesComplex(r, planDeCompte, identifierToLigneBudgetSet, right)
            case '∩':
                return matchesComplex(r, planDeCompte, identifierToLigneBudgetSet, left) && matchesComplex(r, planDeCompte, identifierToLigneBudgetSet, right)
            case '-':
                return matchesComplex(r, planDeCompte, identifierToLigneBudgetSet, left) && !matchesComplex(r, planDeCompte, identifierToLigneBudgetSet, right)
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
export default memoize(function makeLigneBudgetFilterFromFormula(formula, planDeCompte, identifierToLigneBudgetSet) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    try{
        parser.feed(formula);

        if(parser.results[0] === undefined)
            return returnFalseFunction
        else
            return memoize(budgetRow => matchesComplex(budgetRow, planDeCompte, identifierToLigneBudgetSet, parser.results[0]))
    }
    catch(e){
        return returnFalseFunction
    }
})
