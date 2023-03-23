import { Donnees } from './Donnees.js';
import { Menu } from '../Menu.js';
import { BDD } from './BDD.js';

export class Persistance extends BDD{

    static racine: string; // Racine des fichiers
    static contexte: any;

    menu: Menu;
    racine: string = '';
    donnees: Donnees;

    constructor(nav: HTMLElement, corps: HTMLElement) {
        super();
        this.getConfig(); // Appeler la configuration puis les collections
        // Création du menu (pourquoi c'est là, on sait pas)
        this.menu = new Menu(nav, corps);
        // Récupération des données d'AWS
        this.donnees = new Donnees();
    }
    /**
     * Paramétrer le menu des collections à partir des données reçues
     */
    // setMenuData() {
    //     this.menu.data = new Array();
    //     Donnees.collections.forEach(
    //         m => this.menu.data.push({
    //             titre: m.title,
    //             alias: m.alias,
    //             lien: "collection.html",
    //             infos: "Voir la collection",
    //             data: m
    //         })
    //     );
    //     // this.menu.setMenu();
    // }

    
}