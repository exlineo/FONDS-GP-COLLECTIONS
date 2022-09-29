import { Donnees } from "./data/Donnees.js";
import { CustomHTML } from "./HTML.js";

/** Faire des recherches dans l'ensemble des données */
export class Recherche extends CustomHTML{

    moteur:Array<HTMLInputElement> = []; // interagir avec le menu de recherche
    form:HTMLElement; // Formulaire de recherche
    libre!:HTMLElement; // Champs de recherche libre
    facettes!:Array<HTMLElement>;

    constructor(form:HTMLElement){
        super();
        this.form = form;
        this.setLibre();

        this.form.addEventListener('submit', (e:any)=>{
            e.preventDefault();
            this.moteur.forEach(el => console.log(el, el.value))
        });
    }
    /** Faire une recherche libre */
    setLibre(){
        const libre = this.setTextEl('label', 'Faire une recherche libre')
        const input = this.setInput('text', 'Recherche libre', 'libre');

        const choix = this.setHtmlEl('fieldset');
        
        const collec = this.setTextEl('label', 'Collections');
        const noti = this.setTextEl('label', 'Notices')
        const checkCollec = this.setInput('radio', 'collections', 'CorN');
        const checkNoti = this.setInput('radio', 'notices', 'CorN');
        collec.prepend(checkCollec);
        noti.prepend(checkNoti);
        choix.append(collec, noti);

        this.form.append(libre, input, choix);

        this.form.appendChild(this.setCollections());

        const btns = document.createElement('div');
        btns.append(this.setInput('reset', 'Annuler'), this.setInput('submit', 'Envoyer'))
        this.form.appendChild(btns);

        this.moteur.push(input);
        this.moteur.push(checkCollec);
        this.moteur.push(checkNoti);
    }
    // Lister les collections
    setCollections(){
        const field = document.createElement('fieldset');

        Donnees.collections.forEach(c => {
            const label = this.setTextEl('label', c.title);
            const check = this.setInput('checkbox', c.title, '');
            label.prepend(check);
            field.append(label);
            this.moteur.push(check);
        });
        return field;
    }
}