import { Donnees } from './data/Donnees.js';

export class Menu {

    aside: HTMLElement; // La colonne de gauche avec le menu
    nav: HTMLElement; // La navigation dans la colone aside
    corps: HTMLElement; // où écrire le contenu
    data: Array<any> = []; // Données de navigation
    noticeEl: HTMLElement; // Element HTML pour la notice

    constructor(el: HTMLElement, c: HTMLElement) {
        this.aside = el; // Partie gauche du site
        this.nav = this.aside.querySelector('section > nav')!; // Navigation du site
        this.corps = c; // Corps de la page
        this.noticeEl = document.querySelector('#notice')!; // Element HTML pour afficher les notices
        /** Fermer la notice avec la croix */
        this.noticeEl.querySelector('.close')!.addEventListener('click', () => {
            this.noticeEl.classList.toggle('vu');
            this.noticeEl.querySelector('div')!.innerHTML = '';
        });
    };

    // Ecrire le menu dans le HTML
    // setMenu() {
    //     // this.setMenuItems();
    //     for (let i in this.nav) {
    //         console.log("Elements dans Nav", i, this.nav);
    //     }
    // };
    /**
     * Lister les collections et créer les liens de menu
     */
    // setMenuItems() {
    //     const ul = document.createElement('ul');
    //     let i = 0;
    //     console.log("Data menus", this.data);
    //     // Boucle le menu pour générer les balises
    //     this.data.forEach(
    //         m => {
    //             console.log("Menu items", m);
    //             const li = document.createElement('li');
    //             const a = document.createElement('a');

    //             a.setAttribute('title', m.infos);
    //             a.setAttribute('data-index', String(i));
    //             a.innerHTML = `<strong>${m.titre}</strong><br><em>(fonds ${m.data.fonds})</em>`;

    //             li.appendChild(a);
    //             ul.appendChild(li);
    //             // Gérer le clic sur un lien
    //             a.onclick = (i) => {
    //                 console.log("Evénement", i);
    //                 this.setCollection(i);
    //             };
    //             ++i;
    //         });
    //     this.nav.appendChild(ul);
    // }
    // Charger un template HTML
    loadTemplate() {
        console.log("template load");
    };
    /** Créer  */
    setMenuCollections() {

    }
    /**
     * Avertir les collections qu'il faut s'afficher
     * @param {Event} e Evénement reçu
     * @param {Object} m Collection à gérer
     */
    // setCollection(i: any) {
    //     i.preventDefault();
    //     // Créer un événement pour envoyer l'information qu'une case a été cochée avec son ID (cf. Mecanique)
    //     dispatchEvent(new CustomEvent('SET-COLLECTIONS', { detail: i.currentTarget.dataset.index }));
    // }
    // Ecrire un template dans le DOM
    getTemplate(p: any, i: number) {
        fetch('./pages/' + p.lien)
            .then(h => h.text())
            .then(html => {
                this.corps.innerHTML = html;
                Donnees.page = { index: i, alias: p.alias };
            }).catch(er => console.log(er));
    }
}