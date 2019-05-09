import { Set as ImmutableSet, Map as ImmutableMap } from 'immutable';

const FORMULA_MAP = {
    'DEPENSE': 'D',
    'RECETTE': 'R',
    'INVESTISSEMENT': 'I',
    'FONCTIONNEMENT': 'F',
}

function makeFormulaFromMontreuilRows(rows){
    const rowsByRDFI = new Map()

    for(const row of rows){
        const RDFI = FORMULA_MAP[row['Sens']] + FORMULA_MAP[row['Section']]

        let rdfiRows = rowsByRDFI.get(RDFI)
        if(!rdfiRows){
            rdfiRows = []
            rowsByRDFI.set(RDFI, rdfiRows)
        }
        rdfiRows.push(row) // mutating array used as map value
    }

    return [...rowsByRDFI.entries()].map(([RDFI, rows]) => {
        const rowsFormula = rows.map(r => {
            // the two following lines seem to have weird characters in the property names
            // I've copied-pasted the values from aggregation-Montreuil-v4
            // if only rewriting by hand via easily-accessible keyboard keys, it does not work :-/
            const fonction = r["Fonction - Code"]
            const nature = r['Nature - Code']

            return `F${fonction}*N${nature}`
        })
        .join(' + ')

        return `${RDFI}*(${rowsFormula})`
    }).join(' + ')
        
}

function getMontreuilNomenclatureRowKey(MontreuilNomenclatureRow){
    return [
        'Sens',
        'Section',
        'Niveau 2 - Catégorie',
        'Niveau 3 - Type'
    ].map(key => MontreuilNomenclatureRow[key]).join(' - ')
}

function makeFonctionNatureCombo(fonction, nature){
    return fonction + '-' + nature
}

export default function MontreuilNomenclatureToAggregationDescription(montreuilNomenclature, docBudgs){
    let map = new ImmutableMap()

    const docBudgsFonctionNatureCombos = new Set()
    for(const {rows} of docBudgs){
        for(const {Nature, Fonction} of rows){
            docBudgsFonctionNatureCombos.add(makeFonctionNatureCombo(Fonction, Nature))
        }
    }

    montreuilNomenclature = montreuilNomenclature
        .filter(r => r["Nature Mvt"] === "REELLE" && 
            docBudgsFonctionNatureCombos.has(makeFonctionNatureCombo(r["Fonction - Code"], r['Nature - Code']))
        )

    console.log('montreuilNomenclature.length', montreuilNomenclature.length)

    for(const row of montreuilNomenclature){
        const key = getMontreuilNomenclatureRowKey(row);
        const set = map.get(key) || new ImmutableSet()
        map = map.set(key, set.add(row))
    }
    
    return [...map.entries()]
        .map(
            ([name, rows]) => ({name, formula: makeFormulaFromMontreuilRows(rows), montreuilRows: rows})
        )
}