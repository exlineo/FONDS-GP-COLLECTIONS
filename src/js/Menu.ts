import { Donnees } from './data/Donnees.js';

export class Menu {

    aside:HTMLElement; // La colonne de gauche avec le menu
    nav:HTMLElement; // La navigation dans la colone aside
    corps:HTMLElement; // où écrire le contenu
    data:Array<any> = []; // Données de navigation
    collecEvent:CustomEvent;

    constructor(el:HTMLElement, c:HTMLElement) {
        this.aside = el;
        this.nav = this.aside.querySelector('section > nav')!;
        this.corps = c;
        this.collecEvent = new CustomEvent('collection');
    };

    // Ecrire le menu dans le HTML
    setMenu() {
        // this.setMenuItems();
        for(let i in this.nav){
            console.log(i);
        }
    };
    /**
     * Lister les collections et créer les liens de menu
     */
    setMenuItems() {
            const ul = document.createElement('ul');
            let i = 0;
            // Boucle le menu pour générer les balises
            this.data.forEach(
                m => {
                    console.log(m);
                    const li = document.createElement('li');
                    const a = document.createElement('a');

                    a.setAttribute('title', m.infos);
                    a.setAttribute('data-index', String(i));
                    a.innerHTML = `<strong>${m.titre}</strong><br><em>(fonds ${m.data.fonds})</em>`;

                    li.appendChild(a);
                    ul.appendChild(li);
                    // Gérer le clic sur un lien
                    a.onclick = (i) => {
                        this.setCollection(i);
                    };
                    // li.onclick = li.dispatchEvent(this.collecEvent);
                    ++i;
                });
            this.nav.appendChild(ul);
        }
        // Charger un template HTML
    loadTemplate() {
        console.log("template load");
    };
    /**
     * 
     * @param {Event} e Evénement reçu
     * @param {Object} m Collection à gérer
     */
    setCollection(i:any) {
            i.preventDefault();
            // Créer un événement pour envoyer l'information qu'une case a été cochée avec son ID (cf. Mecanique)
            const colEv = new CustomEvent('collection', { detail: i.currentTarget.dataset.index });
            dispatchEvent(colEv);
        }
        // Ecrire un template dans le DOM
    getTemplate(p:any, i:number) {
        fetch('./pages/' + p.lien)
            .then(h => h.text())
            .then(html => {
                this.corps.innerHTML = html;
                Donnees.page = { index: i, alias: p.alias };
            }).catch(er => console.log(er));
    }
}