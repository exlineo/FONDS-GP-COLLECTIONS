import { CustomHTML } from "./HTML.js";
/** Manage events from Web components */
export class CPEvent extends CustomHTML {
    constructor() {
        super();
        this.addEventListener('CPErrorMsg', ev => this.setErrorMsg(ev));
        this.addEventListener('CPValidMsg', ev => this.setValidationMsg(ev));
        this.addEventListener('CPInfoMsg', ev => this.setInfoMsg(ev));
    }
    //// EVENTS ON WEB COMPONENT ////
    /** Web component initiate */
    connectedCallback() {
        // this.setInit();
        this.data = this.dataset.params;
        console.log(JSON.parse(this.dataset.params), parseInt(this.dataset.index));
        console.log(this.children);
        this.dispatchEvent(new CustomEvent('INIT', { detail: { params: JSON.parse(this.dataset.params), index: parseInt(this.dataset.index) } }));
    }
    ;
    /** Surveiller des infos */
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Attribut changé.', name, newValue);
        switch (name) {
            case 'data-params':
                try {
                    // this.params = JSON.parse(this.getStore(newValue)!);
                }
                catch (er) {
                    this.setErrorEvent(er);
                }
                ;
                break;
            case 'data-index':
                try {
                    // this.data = JSON.parse(this.getStore(newValue)!);
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
    /** Throwing event to init */
    setInit() {
        this.dispatchEvent(new CustomEvent('init'));
    }
    /** Throwing error message */
    setErrorEvent(msg) {
        this.dispatchEvent(new CustomEvent('CPErrorMsg', { detail: msg }));
    }
    /** Throwing validation message */
    setValidationEvent(msg) {
        this.dispatchEvent(new CustomEvent('CPErrorMsg', { detail: msg }));
    }
    /** Throwing error message */
    setInfoEvent(msg) {
        this.dispatchEvent(new CustomEvent('CPInfoMsg', { detail: msg }));
    }
    /** Set validation message */
    setValidationMsg(ev) {
        console.log(ev.target, ev.detail);
    }
    /** Set error message */
    setErrorMsg(ev) {
        console.log(ev.target, ev.detail);
    }
    /** Set info message */
    setInfoMsg(ev) {
        console.log(ev.target, ev.detail);
    }
}
