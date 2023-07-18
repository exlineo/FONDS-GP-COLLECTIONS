import { Store } from './Store.js';

export abstract class CustomHTML extends HTMLElement {

    data: any;
    indexN: any;
    va: any; // Video or audio element
    store: Store; // Singleton for data store
    params:any; // Parameters received from html arguments (cd. CPEvent)
    index:string = ''; // Index received from html arguments (cd. CPEvent)

    shadow; // Shadow DOM on the element

    constructor() {
        super();
        this.store = Store.getInstance();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.addStyles();
    }
    // Adding style in the page
    addStyles(){
        if(!document.querySelector('[nemateria]')){
            const style = document.createElement('style');
            style.setAttribute('nemateria', '');
            style.innerHTML = "@import url('./css/nemateria-components.css')";
            this.shadow.append(style);
        }
    }
    /**
         * Get key/ values from object
         * @param {Object} o Object to loop
         */
    decortiqueObj(o: any, el: HTMLElement) {
        const ul = document.createElement('ul');
        ul.className = 'panneau';
        for (let i in o) {
            let li = document.createElement('li');
            if (typeof o[i] == 'string') {
                // li.innerHTML = `${FR[i]} : <span class="b">${o[i].toString()}</span>`;
                li.innerHTML = `${i} : <span class="b">${o[i].toString()}</span>`;
                ul.appendChild(li);
            } else if (Array.isArray(o[i])) {
                this.decortiqueObj(o[i], li);
            }
        };
        el.appendChild(ul);
    }
    /** Créer un élément HTML dans le DOM */
    setTextEl(el: string, text?: string) {
        const e = document.createElement(el);
        if (text) e.textContent = text;
        return e;
    }
    /** Créer un élément HTML dans le DOM */
    setHtmlEl(el: string, html?: string) {
        const e = document.createElement(el);
        if (html) e.innerHTML = html;
        return e;
    }
    /**
     * Afficher une vidéo
     * @param {string} url Lien de la vidéo
     * @param {string} f Format de la vidéo
     */
    setVideoEl(url: string, f: string) {
        const ar = document.createElement('article');
        let vid = `<video controls class="media" id="va">
                <source src="${url}" type="${f}">
                Votre navigateur ne supporte pas ce format vidéo
            </video>`;
        ar.innerHTML = vid;
        return ar;
    }
    /** Créer un champ de formulaire */
    setInput(type: string, val?: any, name?: string, holder?: string) {
        const input = document.createElement('input');
        if (holder) input.setAttribute('placeholder', holder);
        input.type = type;
        if (val) input.value = val;
        if (name) input.setAttribute('name', name);

        return input;
    }
    /** Créer un bouton */
    setBtn(type: string, value: string) {
        const btn = document.createElement('input');
        btn.type = type;
        btn.value = value;

        return btn;
    }
    /** Créer une liste déroulante */
    setSelect(options: Array<{ nom: string, val: any }>, name?: string, multiple?: boolean) {
        const sel = document.createElement('select');
        let html = ''
        if (name) sel.setAttribute('name', name);
        if (multiple) sel.setAttribute('multiple', 'true');
        options.forEach(op => {
            html += `<option value="${op.val}">${op.nom}</option>`
        });
        sel.innerHTML = html;

        return sel;
    }
    /** Créer des boutons radio */
    setRadio(options: Array<{ nom: string, val: any }>, groupe: string) {
        const field = document.createElement('fieldset');

        options.forEach(r => {
            const rad = document.createElement('input');
            rad.type = 'radio';
            rad.setAttribute('group', groupe);
            rad.value = r.val;

            const label = this.setTextEl('label', r.nom);
            label.prepend(rad);
            field.appendChild(label);
        });

        return field;
    }
    /**
     * 
     * @param {string} url Adresse du média
     * @param {string} f Format de l'audio
     */
    setAudioEl(url: string, f: string) {
        const ar = document.createElement('article');
        let aud = `<audio controls src="${url}" class="media" id="va">
                    Votre navigateur ne supporte pas ce format audio
            </audio>`;

        ar.innerHTML = aud;
        return ar;
    }
    /** Créer une image */
    setImgEl(src: string) {
        const i = new Image();
        i.src = src;
        i.setAttribute('loading', 'lazy');
        return i;
    }
    /**
     * Afficher une image
     * @param {string} url Lien vers le document
     */
    setNoticeImageEl(n: any) {
        const ar = document.createElement('article');
        let img = new Image();
        img.src = n.media.url.indexOf('https://') != -1 && n.media.url.indexOf('.s3') != -1 ? n.media.url : `${this.store.config.s3}${n.nema.set_name}/${n.media.file}`;;
        img.className = 'media';
        img.setAttribute('loading', 'lazy');
        ar.appendChild(img);
        return ar;
    }
    /**
     * Afficher un fichier PDF
     * @param {string} url Lien vers le document
     */
    setPdfEl(url: string) {
        const ar = document.createElement('article');
        const frame = document.createElement('iframe');
        frame.className = 'media';
        frame.src = url;

        ar.appendChild(frame);
        return ar;
    }
    /**
         * Afficher une vidéo
         * @param {string} url Lien de la vidéo
         * @param {string} f Format de la vidéo
         */
    setVideo(url: string, f: string) {
        return `<video class="media">
                <source src="${url}" type="${f}">
                Votre navigateur ne supporte pas ce format vidéo
        </video>`;
    }
    /**
     * 
     * @param {string} url Adresse du média
     * @param {string} f Format de l'audio
     */
    setAudio(url: string, f: string) {
        return `<audio src="${url}" class="media">
                        Votre navigateur ne supporte pas ce format audio
                </audio>`;
    }
    /**
     * Afficher un fichier PDF
     * @param {string} url Lien vers le document
     */
    setPdf(url: string) {
        return ``;
    }
    /** Evénements sur les accordéons */
    accordeon(el: Element) {
        el.addEventListener("click", (e: any) => {
            e.preventDefault();
            e.currentTarget.classList.toggle("active");
            // e.stopPropagation();
            let pan = e.currentTarget.nextElementSibling;
            if (pan.style.maxHeight) {
                pan.style.maxHeight = null;
            } else {
                pan.style.maxHeight = pan.scrollHeight + "px";
            }
        });
    }
    /** Afficher un loader dans la page */
    load() {
        document.getElementById('loader')!.style.display = 'flex';
    }
    /** Enlever le loader de la page */
    deload() {
        document.getElementById('loader')!.style.display = 'none';
    }
}