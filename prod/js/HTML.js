import { Donnees } from './data/Donnees.js';
export class CustomHTML {
    constructor(n, o) {
        if (n)
            this.noticesEl = n; // HTML des notices 
        if (o)
            this.noticeEl = o; // Notice à afficher
    }
    /**
         * Décomposer un objet et ses enfants
         * @param {Object} o Objet présumé à décortiquer
         */
    decortiqueObj(o, el) {
        const ul = document.createElement('ul');
        ul.className = 'panneau';
        for (let i in o) {
            let li = document.createElement('li');
            if (typeof o[i] == 'string') {
                li.innerHTML = `${i} : <strong>${o[i].toString()}</strong>`;
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
    setSelect(options) {
        const sel = document.createElement('select');
        let html = '';
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
        img.src = n.media.url.indexOf('https://') != -1 ? n.media.url : `${Donnees.config.g.s3}${n.nema.set_name}/${n.media.file}`;
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
    slide() {
        this.noticeEl.classList.toggle('vu');
    }
}
