import PARAMS from './params.js';
import { Donnees } from './Donnees.js';
import { Menu } from '../Menu.js';

export class Persistance {

    static racine: string; // Racine des fichiers
    static contexte: any;

    menu: Menu;
    racine: string = '';
    donnees: Donnees;

    constructor(nav: HTMLElement, corps: HTMLElement) {
        // Création du menu (pourquoi c'est là, on sait pas)
        this.menu = new Menu(nav, corps);
        // Récupération des données d'AWS
        this.donnees = new Donnees();
    }
    /**
     * Etablir la racine de la page en cours
     * @param {string} r La racine de la page actuelle
     */
    setRacine(r: string) {
        try {
            if (r) this.racine = r;
        } catch (er) {
            console.log("Erreur dans la donnée", er);
        }
    };
    /**
     * Sauvegarder des données dans le localStorage
     * @param {string} i nom de la donnée à sauvegarder
     * @param {any} d données à sauvegarder
     */
    setData(i: string, d: any) {
        localStorage.setItem(i, JSON.stringify(d));
        // Donnees[i] = d;
        // Donnees.getStatic(i, d);
    }
    /**
     * Renvoyer des données du localStorage
     * @param {string} i nom de la donnée à récupérer
     */
    getData(i: string) {
        return localStorage.getItem(i) ? JSON.parse(localStorage.getItem(i)!) : null;
    }
    /**
     * Get Collections
     */
    getCollections() {
        // fetch(PARAMS.SERV + 'collections', PARAMS.HEAD)
        fetch(PARAMS.COLLECTIONS.GET)
            .then(d => d.json())
            .then(j => {
                this.setData('collections', j);
                this.setMenuData();
            })
            .catch(er => console.log(er));
    }
    getNotices(c: any) {

    }
    /**
     * Paramétrer le menu des collections à partir des données reçues
     */
    setMenuData() {
        this.menu.data = new Array();
        Donnees.collections.forEach(
            m => this.menu.data.push({
                titre: m.titre,
                alias: m.alias,
                lien: "collection.html",
                infos: "Voir la collection",
                data: m
            })
        );
        this.menu.setMenu();
    }
}