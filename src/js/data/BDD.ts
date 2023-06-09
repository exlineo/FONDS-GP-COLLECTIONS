import { Donnees } from './Donnees.js';
import PARAMS from "./params.js";
import { CollectionI, NoticeI, Collection, SearchI } from "../models/ModelesI.js";
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
        addEventListener('RECHERCHE', (e) => { this.rechercher(e) });
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
                // Donnees.config.g = d.getters;
                // dispatchEvent('NEMATERIA-INIT')
                this.setLocalData('config', d.getters);
                this.getCollections();
            })
            .catch(er => console.log(er));
    }
    /**
     * Get Collections
     */
    async getCollections() {
        await fetch(Donnees.config.g.collections)
            .then(d => d.json())
            .then(j => {
                this.setLocalData('collections', j);
                // Gérer la liste des collections
                new Collections(document.querySelector('#filtres'), document.getElementById('collections'), document.querySelector('#look'));
                dispatchEvent(new CustomEvent('SET-COLLECTIONS', { detail: j }));
                // Classe pour faire des recherches
                new Recherche(document.querySelector('#recherche > form')!);
            })
            .catch(er => console.log(er));
    }
    /** Récupérer les notices dans la base de données à partir  */
    async getNotices(e: any = null) {
        this.load(); // Afficher le loader
        if(e){
            e.stopImmediatePropagation();
        }
        // Récupérer les données
        if (!Donnees.notices[Donnees.collection.idcollections]) {
            return await fetch(Donnees.config.g.notices, {
                method: 'POST',
                body: JSON.stringify(Donnees.collection.notices)
            })
                .then(d => d.json())
                .then(n => {
                    Donnees.notices[Donnees.collection.idcollections] = n;
                    this.setLocalData('noticesFiltrees', Donnees.notices[Donnees.collection.idcollections]);
                    this.setLocalData('notices', Donnees.notices); // Enregistrer les données en local pour éviter les requêtes
                    dispatchEvent(new CustomEvent('SET-NOTICES', { detail: {collection:Donnees.collection, notices:n} }));
                })
                .catch(er => console.log(er));
        } else {
            // Donnees.noticesFiltrees = Donnees.notices[Donnees.collection.idcollections];
            this.setLocalData('noticesFiltrees', Donnees.notices[Donnees.collection.idcollections]);
            dispatchEvent(new CustomEvent('SET-NOTICES', { detail: {collection:Donnees.collection, notices:Donnees.notices[Donnees.collection.idcollections]} }));
        }
    }
    /** Rechercher dans la base de données */
    rechercher(e: any) {
        e.stopImmediatePropagation();
        const search: SearchI = e.detail;
        search.notices ? this.searchNotices(search) : this.searchCollections(search);
    }
    /** Rechercher dans les notices */
    async searchNotices(r: SearchI) {
        await fetch(Donnees.config.g.search, {
            method: "POST",
            body: JSON.stringify(r), // body data type must match "Content-Type" header
          })
            .then(d => d.json())
            .then(j => {
                this.setLocalData('noticesFiltrees', j);
                Donnees.collection = new Collection();
                // Gérer la liste des collections
                dispatchEvent(new CustomEvent('SET-NOTICES'));
            })
            .catch(er => console.log(er));
    }
    /** Rechercher dans les collections */
    searchCollections(r: SearchI) {
        if (r.collection && r.collection.length > 0) {
            Donnees.collection = Donnees.collections.find(c => c.title == r.collection)!;
            this.getNotices();
        }
    }
    /** Afficher un loader dans la page */
    load(){
        document.getElementById('loader')!.style.display = 'flex';
    }
}