import { CustomHTML } from '../common/HTML.js';
import { FR } from '../trads/fr.js';
export class Notice extends CustomHTML {
    constructor() {
        super();
    }
    ;
    /** Web component initiate */
    connectedCallback() {
        this.params = this.dataset.params;
        console.log(this.dataset.params, this.dataset.index, this.store.list);
        this.store.list = this.store.getLocalStore('noticesFiltrees');
        this.store.notice = this.store.list[parseInt(this.dataset.index)];
        this.init();
    }
    ;
    /** Create the HTMLElement */
    init() {
        const section = document.createElement('section');
        section.className = 'notice';
        const media = document.createElement('section');
        media.id = 'media' + Math.round(Math.random() * 2000);
        const donnees = document.createElement('section');
        donnees.id = 'donnees';
        section.appendChild(media);
        section.appendChild(donnees);
        console.log(this.store.notice);
        const titre = document.createElement('h1');
        titre.textContent = this.store.notice.dc.title;
        donnees.appendChild(titre);
        const description = document.createElement('blockquote');
        description.textContent = this.store.notice.dc.description;
        donnees.appendChild(description);
        let f = this.store.notice.dc.format;
        if (f.indexOf('image') != -1) {
            media.appendChild(this.setNoticeImageEl(this.store.notice));
        }
        else if (f.indexOf('video') != -1 || f.indexOf('audio') != -1) {
            media.innerHTML = `<nema-player data-params={'id':'${media.id}'}`;
        }
        else if (f.indexOf('audio') != -1) {
            media.appendChild(this.setAudioEl(this.store.notice.media.url, f));
        }
        else {
            media.appendChild(this.setPdfEl(this.store.notice.media.url));
        }
        // this.setMedia(donnees);
        // Ecrire les données dans les médias
        this.setDatas(donnees, this.store.notice.media, FR.media_infos);
        this.setDatas(donnees, this.store.notice.dc, FR.dublin_infos);
        this.setDatas(donnees, this.store.notice.nema, FR.metas_infos);
        this.setAccordeon(section);
        this.shadow.appendChild(section);
    }
    /**
     * Media of the document
     * @param {Element} doc Element HTML du document
     */
    setMedia(el) {
        const ar = document.createElement('article');
        const btn = document.createElement('button');
        btn.className = 'accordeon';
        btn.textContent = this.store.t.media_infos;
        console.log(this.store.notice);
        ar.appendChild(btn);
        this.decortiqueObj(this.store.notice.media, ar);
        el.appendChild(ar);
    }
    /**
     * Afficher les métadonnées
     */
    setDatas(el, o, t) {
        const ar = document.createElement('article');
        // const h3 = document.createElement('h3');
        const h3 = document.createElement('button');
        h3.className = 'accordeon';
        h3.textContent = t;
        ar.appendChild(h3);
        this.decortiqueObj(o, ar);
        el.appendChild(ar);
    }
    /** Open close lists of metadata */
    setAccordeon(el) {
        // ACCORDEON
        const acc = el.getElementsByClassName("accordeon");
        for (let i = 0; i < acc.length; i++) {
            this.accordeon(acc[i]);
        }
    }
}
/** Define WebComponent */
customElements.define('nema-notice', Notice);
