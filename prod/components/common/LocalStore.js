var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CPEvent } from "./CPEvent.js";
/** Hériter de possibilités de gestion des données */
export class LocalStore extends CPEvent {
    constructor() {
        super();
        this.index = ''; // Name of index of datas to sync from localstorage
        this.index = this.dataset['index']; // Get index of data in dataset
        let p = this.dataset['params'];
        console.log(typeof p, p, this.index, this.getStore(this.index));
        this.params = JSON.parse(this.dataset['params']); // Get configuration parameters
        this.data = JSON.parse(this.getStore(this.index)); // Get datas in local storage
        /** Sync data from local storage to get any change */
        window.addEventListener('storage', () => {
            console.log(this.index, JSON.parse(window.localStorage.getItem(this.index)));
        });
    }
    /** Set data on localstorage */
    setStore(index, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!window.localStorage.getItem(index)) {
                yield window.localStorage.setItem(index, JSON.stringify(obj));
            }
            return 'Data sets';
        });
    }
    /** Get data from localstorage */
    getStore(index) {
        try {
            return window.localStorage.getItem(index);
        }
        catch (er) {
            this.setErrorEvent(er);
            return;
        }
    }
    /** Delete data on localstorage */
    delStore(index) {
        window.localStorage.removeItem(index);
        return 'Data deleted';
    }
    //// EVENTS ON WEB COMPONENT ////
    /** Web component initiate */
    connectedCallback() {
        this.setInit();
    }
    ;
    /** Surveiller des infos */
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Attribut changé.', name, newValue, this.index);
        switch (name) {
            case 'data-param':
                try {
                    this.params = JSON.parse(this.getStore(newValue));
                }
                catch (er) {
                    this.setErrorEvent(er);
                }
                ;
                break;
            case 'data-index':
                try {
                    this.data = JSON.parse(this.getStore(newValue));
                }
                catch (er) {
                    this.setErrorEvent(er);
                }
                ;
                break;
        }
    }
    /** Info sur la déconnexion de l'élément */
    disconnectedCallback() {
        console.log('Le slideshow a été enlevé de la page');
    }
    adoptedCallback() {
        console.log('Slideshow bougé ailleurs.');
    }
    static get observedAttributes() {
        return ['data-params', 'data-index'];
    }
}
