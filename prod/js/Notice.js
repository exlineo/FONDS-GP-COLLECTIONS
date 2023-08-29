import { CustomHTML } from "./HTML.js";
import { Donnees } from "./data/Donnees.js";
import { FR } from './trads/fr.js';
export class Notice extends CustomHTML {
    constructor() {
        super();
        this.notice = {};
        this.index = 0;
        this.ids = [];
        this.initNotice(); // Initier la première notice
    }
    initNotice() {
        // Vérifir la notice qu'on affiche si elle a déjà été ajoutée dans le DOM ou pas
        if (this.ids.includes(Donnees.indexN)) {
            this.index = this.ids.indexOf(Donnees.indexN);
        }
        else {
            this.ids.push(Donnees.indexN); // Liste des notices écrites dans le DOM
            this.index = this.ids.length - 1; // Nombre total de notices inscrites dans le DOM
            this.setNoticeEl(); // Ecrire une notice
        }
        ;
        this.setPosition();
    }
    /** Création d'une notice */
    setNoticeEl() {
        const section = document.createElement('section');
        section.className = 'notice';
        const media = document.createElement('section');
        media.id = 'media';
        const donnees = document.createElement('section');
        donnees.id = 'donnees';
        section.appendChild(media);
        section.appendChild(donnees);
        this.notice = Donnees.noticesFiltrees[Donnees.indexN]; // Métadonnées de la notice
        const titre = document.createElement('h1');
        titre.textContent = this.notice.dc.title;
        donnees.appendChild(titre);
        const description = document.createElement('blockquote');
        description.textContent = this.notice.dc.description;
        donnees.appendChild(description);
        // Traiter le format des notices
        let f = this.getFormat(this.notice);
        if (f.indexOf('image') != -1) {
            media.appendChild(this.setNoticeImageEl(this.notice));
        }
        else if (f.indexOf('video') != -1) {
            media.appendChild(this.setVideoEl(this.notice.media.url, f));
        }
        else if (f.indexOf('audio') != -1) {
            media.appendChild(this.setAudioEl(this.notice.media.url, f));
        }
        else {
            media.appendChild(this.setPdfEl(this.notice.media.url));
        }
        // this.setMedia(donnees);
        // Ecrire les données dans les médias
        this.setDatas(donnees, this.notice.media, FR.media_infos);
        this.setDatas(donnees, this.notice.dc, FR.dublin_metas);
        this.setDatas(donnees, this.notice.nema, FR.metas_infos);
        this.setAccordeon(section);
        // this.listeNoticesEl.appendChild(section);
        const nemaNot = document.createElement('nema-notice');
        nemaNot.dataset.index = Donnees.indexN.toString();
        // nemaNot.dataset.params = '{"coucou":"Et ouais"}';
        this.listeNoticesEl.appendChild(nemaNot);
    }
    /** Indiquer le mouvement que doivent faire les notices pour afficher la notice qu'il faut */
    setPosition() {
        // this.noticeEl.style.right = 0;
        this.listeNoticesEl.style.left = -(this.noticeEl.offsetWidth * this.index) + 'px';
    }
    /**
     * Showing informations of the document (deprecated)
     * @param {Element} doc HTML Element of the document
     */
    setMedia(el) {
        const ar = document.createElement('article');
        const btn = document.createElement('button');
        btn.className = 'accordeon';
        btn.textContent = FR.media_infos;
        ar.appendChild(btn);
        this.decortiqueObj(this.notice.media, ar);
        el.appendChild(ar);
    }
    /** Show metadatas */
    setDatas(el, o, t) {
        const ar = document.createElement('article');
        const btn = document.createElement('button');
        btn.className = 'accordeon';
        btn.textContent = t;
        ar.appendChild(btn);
        this.decortiqueObj(o, ar);
        el.appendChild(ar);
    }
    /** Show sequences in media */
    setSequences(el) {
        if (this.notice.nema.sequences) {
            const s = this.notice.nema.sequences;
            const ar = document.createElement('article');
            const h3 = document.createElement('h3');
            h3.textContent = FR.sequences;
            ar.appendChild(h3);
            const time = s.time_code.indexOf(',') != -1 ? s.time_code.split(',') : [];
            const seq = s.sequence.indexOf(',') != -1 ? s.sequence.split(',') : [];
            const duree = s.duree_sequence.indexOf(',') != -1 ? s.duree_sequence.split(',') : [];
            const resume = s.resume_sequence.indexOf(',') != -1 ? s.resume_sequence.split(',') : [];
            for (let i = 0; i < time.length; ++i) {
                let p = document.createElement('p');
                let a = document.createElement('a');
                a.classList.add('sequence');
                a.innerHTML = `
                        <span>${seq[i] ? seq[i].trim() : i}</span><span>${resume[i] ? resume[i].trim() : 'aller à la séquence'}</span><span>${duree[i] ? duree[i].trim() : ''}</span>
                    `;
                a.setAttribute('data-timecode', time[i].trim());
                ar.appendChild(a);
                a.addEventListener('click', (e) => {
                    this.va.currentTime = e.currentTarget.dataset.timecode / 1000;
                    this.va.play();
                });
            }
            el.appendChild(ar);
        }
    }
    /** Create an accordeon */
    setAccordeon(el) {
        // ACCORDEON
        const acc = el.getElementsByClassName("accordeon");
        for (let i = 0; i < acc.length; i++) {
            this.accordeon(acc[i]);
        }
    }
}
