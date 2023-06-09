/** Store to store shared data */
export class Store {
    constructor() {
        this.t = {}; // Selected language
        this.s3 = ''; // Base to call ressources from Cloud
        this.config = { s3: '' };
        this.config = this.getLocalStore('config');
        addEventListener('NEMATERIA-INIT', (e) => {
            this.setLocalStore('config', JSON.stringify(e.detail));
        });
    }
    /**
     * The static method that controls the access to the Store instance.
     *
     * This implementation let you subclass the Store class while keeping
     * just one instance of each subclass around.
     */
    static getInstance() {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }
    /** Get data from sessionstorage */
    getLocalSession(id) {
        return JSON.parse(sessionStorage.getItem(id));
    }
    /** Set data in sessionstorage */
    setLocalSession(id, obj) {
        return sessionStorage.setItem(id, JSON.stringify(obj));
    }
    /** Get data from sessionstorage */
    getLocalStore(id) {
        try {
            const tmp = JSON.parse(localStorage.getItem(id));
            return tmp;
            if (Number.isInteger(tmp)) {
                return parseInt(tmp);
            }
            else if (Object.keys(tmp).length > 0 || Array.isArray(tmp)) {
                return JSON.parse(tmp);
            }
            else {
                return tmp;
            }
        }
        catch (er) {
            console.log(er);
        }
    }
    /** Set data in sessionstorage */
    setLocalStore(id, obj) {
        return localStorage.setItem(id, JSON.stringify(obj));
    }
    /** Get translations
     * @param {string} url of language translated to load
    */
    getTranslations(url) {
        if (localStorage.getItem('language')) {
            this.t = JSON.parse(localStorage.getItem('language'));
        }
        else {
            fetch(url)
                .then(data => data.json())
                .then(translate => this.t = translate)
                .catch(er => console.log(er));
        }
    }
}
