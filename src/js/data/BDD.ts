import { Donnees } from './Donnees.js';
import PARAMS from "./params.js";
import { CollectionI, NoticeI, ConfigI } from "../models/ModelesI.js";
import { Collections } from '../Collections.js';
import { Recherche } from '../Recherche.js';

export abstract class BDD {

    racine!: string; // Racine pour le chargement des données
    /** Les des données chargées depuis la base de données */
    listeNotices: any = <{ idcollections: Array<NoticeI> }>{};
    collection: CollectionI = <CollectionI>{};
    notice: NoticeI = <NoticeI>{};

    constructor() {
        addEventListener('GET-NOTICES', (e) => { this.getNotices(e) });
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
    getConfig() {
        fetch(PARAMS.CONFIG)
            .then(d => d.json())
            .then(d => {
                Donnees.config.g = d.getters;
                this.getCollections();
            })
            .catch(er => console.log(er));
    }
    /**
     * Get Collections
     */
    getCollections() {
        fetch(Donnees.config.g.collections)
            .then(d => d.json())
            .then(j => {
                this.setLocalData('collections', j);
                Donnees.collections = j;
                // Gérer la liste des collections
                new Collections(document.querySelector('#filtres'), document.getElementById('collections'), document.querySelector('#look'));
                dispatchEvent(new CustomEvent('SET-COLLECTIONS', { detail: j }));
                // Classe pour faire des recherches
                new Recherche(document.querySelector('#recherche > form')!);
            })
            .catch(er => console.log(er));
    }
    /** Récupérer les notices dans la base de données à partir  */
    getNotices(e: any) {
        this.collection = e.detail;
        console.log(this.collection);
        if (!Donnees.notices[this.collection.idcollections]) {
            return fetch(Donnees.config.g.notices, {
                method: 'POST',
                body: JSON.stringify(this.collection.notices)
            })
            .then(d => d.json())
            .then(n => {
                Donnees.notices[this.collection.idcollections] = n.Responses.notices;
                Donnees.noticesFiltrees = n.Responses.notices;
                dispatchEvent(new CustomEvent('SET-NOTICES', {detail:n.Responses.notices}));
            })
            .catch(er => console.log(er));
        }else{
            Donnees.noticesFiltrees = Donnees.notices[this.collection.idcollections];
            dispatchEvent(new CustomEvent('SET-NOTICES', {detail:Donnees.notices[this.collection.idcollections]}));
        }

    }
}