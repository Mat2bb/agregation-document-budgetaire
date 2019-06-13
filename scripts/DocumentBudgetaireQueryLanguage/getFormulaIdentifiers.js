import nearley from 'nearley';

import grammar from './grammar.js'

// This file needs to be in sync with the grammar file (grammar.ne)

const FORMULA_CONSTS = new Set([
    'D', 'R', 
    'RF', 'RI', 'DF', 'DI',
    '(', ')',
    '∩', '+', '∪', '-'
])

export default function(formula){
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    try{
        parser.feed(formula);

        return parser.results[0] === undefined ?
            [] :
            parser.results[0]
                .flat(Infinity)
                .filter(token => !FORMULA_CONSTS.has(token) &&
                    throw `TODO regexp pour les CH, C, F, Ann`
                    /*
                        CHAPITRE -> "Ch" [0-9]:+         {% ts => ts[0]+ts[1].join('') %}

COMPTE -> "C" [0-9]:+           {% ts => ts[0]+ts[1].join('') %}

FONCTION -> "F" [0-9]:+         {% ts => ts[0]+ts[1].join('') %}

ANNEE -> "Ann" [0-9]:+      
                    */
                )
    }
    catch(e){
        return returnFalseFunction
    }
}
