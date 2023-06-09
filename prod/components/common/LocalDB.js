import { LocalStore } from "./LocalStore.js";
/** Hériter de possibilités de gestion des données */
export class LocalDB extends LocalStore {
    constructor() {
        super();
    }
    /** Initialiser la base de données */
    initLocalDb() {
        this.indexedDB = window.indexedDB;
        this.open = this.indexedDB.open('WebCPDB', 1); // Récupérer la version 1 de la BDD Web Component
        /** Create the schema */
        this.open.onupgradeneeded = (ev = null) => {
            console.log("onupgrade");
            this.db = this.open.result;
            this.store = this.db.createObjectStore("WebCPStore", { keyPath: "id" });
            this.indexDB = this.store.createIndex(this.index, []);
        };
        /** Success on DB opening */
        this.open.onsuccess = () => {
            // Start a new transaction
            this.db = this.open.result;
            this.tx = this.db.transaction("WebCPStore", "readwrite");
            this.store = this.tx.objectStore("WebCPStore");
            // this.index = this.store.index(this.index);
            // Close the db when the transaction is done
            this.tx.oncomplete = () => {
                this.db.close();
                console.log("transaction close");
            };
            this.tx.onerror = (ev = null) => {
                console.warn(this.tx.error);
                this.setErrorEvent(this.tx.error);
            };
            console.log("Ouverture de la base réussie");
        };
    }
    /** Add data to data store */
    putDBStore(obj, key = null) {
        console.log(this.store, this, this.db);
        let putS = this.store.put(obj, key);
        putS.onsuccess = () => {
            console.log(putS.transaction);
        };
    }
    /** Ajouter des données dans le store */
    addDBStore(obj) {
        let addS = this.store.add(obj);
        // let putS = this.store.put(obj);
        addS.onsuccess = () => {
            console.log(addS.transaction);
        };
    }
    /** Récupérer des données du store */
    getDBStore(s) {
        let getS = this.store.get(s);
        getS.onsuccess = () => {
            console.log(getS.result);
        };
    }
    /** Récupérer des données depuis un index dans le store */
    getDBIndex(i) {
        let getI = this.store.get(i);
        getI.onsuccess = () => {
            console.log(getI.result);
        };
    }
}
