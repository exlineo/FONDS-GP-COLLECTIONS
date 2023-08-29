import { Store } from './Store.js';
import { FR } from '../trads/fr.js';
export class CustomHTML extends HTMLElement {
    constructor() {
        super();
        this.index = ''; // Index received from html arguments (cd. CPEvent)
        this.store = Store.getInstance();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.addStyles();
    }
    // Adding style in the page
    addStyles() {
        if (!document.querySelector('[nemateria]')) {
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
    decortiqueObj(o, el) {
        const ul = document.createElement('ul');
        ul.className = 'panneau';
        for (let i in o) {
            let li = document.createElement('li');
            if (typeof o[i] == 'string') {
                // li.innerHTML = `${FR[i]} : <span class="b">${o[i].toString()}</span>`;
                li.innerHTML = `${FR[i]} : <span class="b">${o[i].toString()}</span>`;
                ul.appendChild(li);
            }
            else if (Array.isArray(o[i])) {
                this.decortiqueObj(o[i], li);
            }
        }
        ;
        el.appendChild(ul);
    }
    /** Créer un élément HTML dans le DOM */
    setTextEl(el, text) {
        const e = document.createElement(el);
        if (text)
            e.textContent = text;
        return e;
    }
    /** Créer un élément HTML dans le DOM */
    setHtmlEl(el, html) {
        const e = document.createElement(el);
        if (html)
            e.innerHTML = html;
        return e;
    }
    /**
     * Afficher une vidéo
     * @param {string} url Lien de la vidéo
     * @param {string} f Format de la vidéo
     */
    setVideoEl(url, f) {
        const ar = document.createElement('article');
        let vid = `<video controls class="media" id="va">
                <source src="${url}" type="${f}">
                Votre navigateur ne supporte pas ce format vidéo
            </video>`;
        ar.innerHTML = vid;
        return ar;
    }
    /** Créer un champ de formulaire */
    setInput(type, val, name, holder) {
        const input = document.createElement('input');
        if (holder)
            input.setAttribute('placeholder', holder);
        input.type = type;
        if (val)
            input.value = val;
        if (name)
            input.setAttribute('name', name);
        return input;
    }
    /** Créer un bouton */
    setBtn(type, value) {
        const btn = document.createElement('input');
        btn.type = type;
        btn.value = value;
        return btn;
    }
    /** Créer une liste déroulante */
    setSelect(options, name, multiple) {
        const sel = document.createElement('select');
        let html = '';
        if (name)
            sel.setAttribute('name', name);
        if (multiple)
            sel.setAttribute('multiple', 'true');
        options.forEach(op => {
            html += `<option value="${op.val}">${op.nom}</option>`;
        });
        sel.innerHTML = html;
        return sel;
    }
    /** Créer des boutons radio */
    setRadio(options, groupe) {
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
    setAudioEl(url, f) {
        const ar = document.createElement('article');
        let aud = `<audio controls src="${url}" class="media" id="va">
                    Votre navigateur ne supporte pas ce format audio
            </audio>`;
        ar.innerHTML = aud;
        return ar;
    }
    /** Créer une image */
    setImgEl(src) {
        const i = new Image();
        i.src = src;
        i.setAttribute('loading', 'lazy');
        return i;
    }
    /**
     * Afficher une image
     * @param {string} url Lien vers le document
     */
    setNoticeImageEl(n) {
        const ar = document.createElement('article');
        let img = new Image();
        img.src = n.media.url.indexOf('https://') != -1 && n.media.url.indexOf('.s3') != -1 ? n.media.url : `${this.store.config.s3}${n.nema.set_name}/${n.media.file}`;
        ;
        img.className = 'media';
        img.setAttribute('loading', 'lazy');
        ar.appendChild(img);
        return ar;
    }
    /**
     * Afficher un fichier PDF
     * @param {string} url Lien vers le document
     */
    setPdfEl(url) {
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
    setVideo(url, f) {
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
    setAudio(url, f) {
        return `<audio src="${url}" class="media">
                        Votre navigateur ne supporte pas ce format audio
                </audio>`;
    }
    /**
     * Afficher un fichier PDF
     * @param {string} url Lien vers le document
     */
    setPdf(url) {
        return ``;
    }
    /** Evénements sur les accordéons */
    accordeon(el) {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            e.currentTarget.classList.toggle("active");
            // e.stopPropagation();
            let pan = e.currentTarget.nextElementSibling;
            if (pan.style.maxHeight) {
                pan.style.maxHeight = null;
            }
            else {
                pan.style.maxHeight = pan.scrollHeight + "px";
            }
        });
    }
    /** Afficher un loader dans la page */
    load() {
        document.getElementById('loader').style.display = 'flex';
    }
    /** Enlever le loader de la page */
    deload() {
        document.getElementById('loader').style.display = 'none';
    }
}
