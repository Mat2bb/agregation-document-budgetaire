
export function makeLigneBudgetId(ligneBudget){
    return [
        ligneBudget['CodRD'],
        ligneBudget['Fonction'],
        ligneBudget['Nature']
    ].join(' ');
}