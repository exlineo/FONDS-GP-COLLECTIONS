import { Donnees } from "./data/Donnees.js";
import { CustomHTML } from "./HTML.js";
import { SearchI } from "./models/ModelesI.js";

import { FR } from "./trads/fr.js";

/** Faire des recherches dans l'ensemble des données */
export class Recherche extends CustomHTML{

    // moteur:Array<HTMLInputElement> | Array<HTMLSelectElement> = []; // interagir avec le menu de recherche
    form:HTMLFormElement; // Formulaire de recherche
    libre!:HTMLElement; // Champs de recherche libre
    facettes!:Array<HTMLElement>;

    constructor(form:HTMLFormElement){
        super();
        this.form = form;
        
        this.form.parentElement!.prepend(this.setTextEl('h2', FR.RECHERCHE));

        this.form.addEventListener('submit', (e:any)=>{
            e.preventDefault();
            this.load();
            const search:SearchI = <SearchI>{};
            search.notices = e.target.elements['CorN'].value == 'Notices' ? true : false;
            search.libre = e.target.elements['libre'].value.split(',');
            search.collection = e.target.elements['collections'].value;
            dispatchEvent(new CustomEvent('RECHERCHE', { detail: search }));
        });
        
        this.setLibre();
    }
    /** Faire une recherche libre */
    setLibre(){
        const field = document.createElement('fieldset');
        // const libre = this.setTextEl('label', FR.RECHERCHE_LIBRE)
        const input = this.setInput('text', '', 'libre', FR.RECHERCHE_LIBRE);
        const inputDescr = this.setTextEl('span', FR.RECHERCHE_LIBRE_DESCR);
        field.appendChild(input);
        field.appendChild(inputDescr);

        const choix = this.setHtmlEl('fieldset');
        const label = this.setTextEl('label', FR.RECHERCHE_CHOIX);
        
        // const tout = this.setTextEl('label', FR.RECHERCHE_TOUT);
        const collec = this.setTextEl('label', FR.COLLECTIONS);
        const noti = this.setTextEl('label', FR.NOTICES);

        // const checkTout = this.setInput('radio', FR.RECHERCHE_OUT, 'CorN');
        // checkTout.setAttribute('checked', 'true');
        const checkCollec = this.setInput('radio', FR.COLLECTION, 'CorN');
        const checkNoti = this.setInput('radio', FR.NOTICES, 'CorN');
        checkNoti.setAttribute('checked', 'true');

        collec.prepend(checkCollec);
        noti.prepend(checkNoti);
        // tout.prepend(checkTout);

        choix.append(label, collec, noti);
        this.form.append(field, choix);

        this.form.appendChild(this.setCollections());

        const btns = document.createElement('div');
        btns.append(this.setInput('reset', 'Annuler'), this.setInput('submit', 'Envoyer'))
        this.form.appendChild(btns);
    }
    // Lister les collections
    setCollections(){
        const field = document.createElement('fieldset');
        const label = this.setTextEl('label', FR.RECHERCHE_COLLECTIONS)
        const options:any = [{nom:FR.RECHERCHE_COLLECTIONS, val:''}];
        Donnees.collections.forEach(c => {
            options.push({nom:c.title, val:c.title});
        });
        const liste = this.setSelect(options, 'collections', false);
        field.append(label, liste);
        return field;
    }
}