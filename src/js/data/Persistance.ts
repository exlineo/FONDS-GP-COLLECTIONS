import PARAMS from './params.js';
import { Donnees } from './Donnees.js';
import { Menu } from '../Menu.js';
import { BDD } from './BDD.js';
import { ConfigI } from '../models/ModelesI.js';

export class Persistance extends BDD{

    static racine: string; // Racine des fichiers
    static contexte: any;

    menu: Menu;
    racine: string = '';
    donnees: Donnees;
    config:ConfigI = <ConfigI>{}; // Stocker les données de configuration comme les adresses de connexion

    constructor(nav: HTMLElement, corps: HTMLElement) {
        super();
        this.getConfig();
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
    setLocalData(i: string, d: any) {
        localStorage.setItem(i, JSON.stringify(d));
        Donnees.setStatic(i, d);
    }
    /**
     * Renvoyer des données du localStorage
     * @param {string} i nom de la donnée à récupérer
     */
    getLocalData(i: string) {
        return localStorage.getItem(i) ? JSON.parse(localStorage.getItem(i)!) : null;
    }
    /** Récupérer les liens d'accès aux bases de données */
    getConfig(){
        fetch(PARAMS.CONFIG)
        .then(d => d.json())
        .then(d => {
            this.config.g = d.getters;
            this.getCollections();
        })
        .catch(er => console.log(er));
    }
    /**
     * Get Collections
     */
    getCollections() {
        // fetch(PARAMS.SERV + 'collections', PARAMS.HEAD)
        console.log(this.config.g.collection);
        fetch(this.config.g.collections)
            .then(d => d.json())
            .then(j => {
                this.setLocalData('collections', j);
                dispatchEvent(new CustomEvent('collections', { detail:j }));
                console.log(j);
            })
            .catch(er => console.log(er));
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