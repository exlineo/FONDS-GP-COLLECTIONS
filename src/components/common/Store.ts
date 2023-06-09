import { ConfigI } from "../models/NoticeI";

/** Store to store shared data */
export class Store {
    private static instance: Store;

    t: any = {}; // Selected language
    s3: string = ''; // Base to call ressources from Cloud
    config:ConfigI = {s3:''};

    private constructor() {
        this.config = this.getLocalStore('config');
        addEventListener('NEMATERIA-INIT', (e: any) => {
            this.setLocalStore('config', JSON.stringify(e.detail))
        })
    }
    /**
     * The static method that controls the access to the Store instance.
     *
     * This implementation let you subclass the Store class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }

        return Store.instance;
    }

    /** Get data from sessionstorage */
    getLocalSession(id: string) {
        return JSON.parse(sessionStorage.getItem(id)!);
    }
    /** Set data in sessionstorage */
    setLocalSession(id: string, obj: any) {
        return sessionStorage.setItem(id, JSON.stringify(obj));
    }
    /** Get data from sessionstorage */
    getLocalStore(id: string) {
        try {
            const tmp = JSON.parse(localStorage.getItem(id)!);
            return tmp;
            if (Number.isInteger(tmp)) {
                return parseInt(tmp!);
            } else if (Object.keys(tmp).length > 0 || Array.isArray(tmp)) {
                return JSON.parse(tmp!);
            } else {
                return tmp;
            }
        } catch (er) {
            console.log(er);
        }

    }
    /** Set data in sessionstorage */
    setLocalStore(id: string, obj: any) {
        return localStorage.setItem(id, JSON.stringify(obj));
    }
    /** Get translations
     * @param {string} url of language translated to load
    */
    getTranslations(url?: string) {
        if (localStorage.getItem('language')) {
            this.t = JSON.parse(localStorage.getItem('language')!);
        } else {
            fetch(url!)
                .then(data => data.json())
                .then(translate => this.t = translate)
                .catch(er => console.log(er))
        }
    }
}