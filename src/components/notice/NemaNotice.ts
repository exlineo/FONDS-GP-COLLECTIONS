import { NoticeI } from '../models/NoticeI.js';
import { CustomHTML } from '../common/HTML.js';

export class Notice extends CustomHTML {

    noticesList:Array<NoticeI> = [];
    notice:NoticeI = <NoticeI>{}; // Metadata of the notice
    /**
     * Generic model to write a notice on the DOM (works with notices slider)
     * @param n Daa of the notice
     * @param noticeEl HTMLElement to write the notice
     */
    constructor(){
        super();
    };
    /** Web component initiate */
    connectedCallback() {
        // this.setInit();
        this.data = this.dataset.params;
        const list = this.store.getLocalStore("noticesFiltrees");
        this.noticesList = list ? list : [];
        this.notice = this.noticesList[parseInt(this.dataset.index!)];
        this.init();
    };
    /** Create the HTMLElement */
    init() {
        const section = document.createElement('section');
        section.className = 'notice';

        const media = document.createElement('section');
        media.id = 'media';
        const donnees = document.createElement('section');
        donnees.id = 'donnees';

        section.appendChild(media);
        section.appendChild(donnees);

        const titre = document.createElement('h1');
        titre.textContent = this.notice.dc.title;
        donnees.appendChild(titre);

        const description = document.createElement('blockquote');
        description.textContent = this.notice.dc.description;
        donnees.appendChild(description);

        let f = this.notice.dc.format;
        if (f.indexOf('image') != -1) {
            media.appendChild(this.setNoticeImageEl(this.notice));
        } else if (f.indexOf('video') != -1) {
            media.appendChild(this.setVideoEl(this.notice.media.url, f));
        } else if (f.indexOf('audio') != -1) {
            media.appendChild(this.setAudioEl(this.notice.media.url, f));
        } else {
            media.appendChild(this.setPdfEl(this.notice.media.url));
        }

        this.setMedia(donnees);
        // Ecrire les données dans les médias
        this.setDatas(donnees, this.notice.dc, this.store.t.dc);
        this.setDatas(donnees, this.notice.nema, this.store.t.meta);
        this.setAccordeon(section);

        this.shadow.appendChild(section);
    }
    /**
     * Media of the document
     * @param {Element} doc Element HTML du document
     */
    setMedia(el: HTMLElement) {
        const ar = document.createElement('article');
        const btn = document.createElement('button');
        btn.className = 'accordeon';
        btn.textContent = this.store.t.media_infos;
        ar.appendChild(btn);
        this.decortiqueObj(this.notice.media, ar);
        el.appendChild(ar);
    }
    /**
     * Afficher les métadonnées
     */
    setDatas(el: HTMLElement, o: any, t: string) {
        const ar = document.createElement('article');
        // const h3 = document.createElement('h3');
        const h3 = document.createElement('button');
        h3.className = 'accordeon';
        h3.textContent = t;
        ar.appendChild(h3);
        this.decortiqueObj(o, ar);
        el.appendChild(ar);
    }
    /** Afficher les séquences d'un document multimédia */
    setSequences(el: HTMLElement) {
        if (this.notice.nema.sequences) {
            const s = this.notice.nema.sequences;

            const ar = document.createElement('article');
            const h3 = document.createElement('h3');
            h3.textContent = this.store.t.sequences;
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
                a.setAttribute('data-timecode', time[i].trim())
                ar.appendChild(a);
                a.addEventListener('click', (e: any) => {
                    this.va.currentTime = e.currentTarget.dataset.timecode / 1000;
                    this.va.play();
                })
            }
            el.appendChild(ar);
        }
    }
    /** Open close lists of metadata */
    setAccordeon(el: HTMLElement) {
        // ACCORDEON
        const acc: HTMLCollection = el.getElementsByClassName("accordeon");
        for (let i = 0; i < acc.length; i++) {
            this.accordeon(acc[i]);
        }
    }
}

/** Define WebComponent */
customElements.define('nema-notice', Notice);