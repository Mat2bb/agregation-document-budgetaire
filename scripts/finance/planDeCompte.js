
export function fromXMLDocument(pc){
    const Nomenclature = pc.querySelector('Nomenclature')
    
    const chapitreCodeByNatureR = new Map()
    const chapitreCodeByNatureD = new Map()

    for(const c of Nomenclature.querySelectorAll('Compte')){
        const code = c.getAttribute('Code');

        chapitreCodeByNatureR.set(code, c.getAttribute('RR'))
        chapitreCodeByNatureD.set(code, c.getAttribute('DR'))
    }

    const FIByChapitreCode = new Map()

    for(const ch of Nomenclature.querySelectorAll('Chapitre')){
        const code = ch.getAttribute('Code');
        
        FIByChapitreCode.set(code, ch.getAttribute('Section'))
    }

    return {
        Norme: Nomenclature.getAttribute('Norme'),
        Declinaison: Nomenclature.getAttribute('Declinaison'),
        Exer: Number(Nomenclature.getAttribute('Exer')),

        ligneBudgetFI({CodRD, Nature}){
            const chapitreCodeByNature = CodRD === 'R' ? chapitreCodeByNatureR : chapitreCodeByNatureD;
            const chapitreCode = chapitreCodeByNature.get(Nature);

            return FIByChapitreCode.get(chapitreCode)
        },
        ligneBudgetChapitre({CodRD, Nature}){
            const chapitreCodeByNature = CodRD === 'R' ? chapitreCodeByNatureR : chapitreCodeByNatureD;
            return chapitreCodeByNature.get(Nature);
        },
        ligneBudgetIsInChapitre({CodRD, Nature}, chapitre){
            const chapitreCodeByNature = CodRD === 'R' ? chapitreCodeByNatureR : chapitreCodeByNatureD;
            const chapitreCode = chapitreCodeByNature.get(Nature);

            return chapitreCode === chapitre
        },
        ligneBudgetIsInCompte({Nature}, compte){
            const compteElement = Nomenclature.querySelector(`Compte[Code="${Nature}"]`)

            if(!compteElement) // compte does not exist for this nature
                return false;

            // look up to see if the compte is a parent of the LigneBudget's Nature
            let testedCompteElement = compteElement;

            while(testedCompteElement){
                if(testedCompteElement.getAttribute('Code') === compte){
                    return true;
                }
                else{
                    testedCompteElement = testedCompteElement.parentNode;
                    
                    if(testedCompteElement.localName.toLowerCase() !== 'Compte'.toLowerCase())
                        return false;
                }
            }

            return false;
        },
        ligneBudgetIsInFonction({Fonction}, fonction){
            const fonctionElement = Nomenclature.querySelector(`RefFonctionnelles RefFonc[Code="${Fonction}"]`)

            if(!fonctionElement) // compte does not exist for this nature
                return false;

            // look up to see if the compte is a parent of the LigneBudget's Nature
            let testedFonctionElement = fonctionElement;

            while(testedFonctionElement){
                if(testedFonctionElement.getAttribute('Code') === fonction){
                    return true;
                }
                else{
                    testedFonctionElement = testedFonctionElement.parentNode;
                    
                    if(testedFonctionElement.localName.toLowerCase() !== 'RefFonc'.toLowerCase())
                        return false;
                }
            }

            return false;
        }
    }
}