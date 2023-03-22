import { CustomHTML } from "./HTML.js";
import { gsap } from "gsap";
import { NoticeI } from "./models/ModelesI.js";
import { Donnees } from "./data/Donnees.js";
import { FR } from './trads/fr.js';

export class Notice extends CustomHTML {
    metas: any; // Métadonnées de la notice
    va: any; // Au cas ou des médias de type vidéo ou audio soient créés
    notice: NoticeI = <NoticeI>{};
    index: number = 0;
    ids:Array<number> = [];

    constructor() {
        super();
        this.initNotice(); // Initier la première notice
    }
    initNotice(){
        // Vérifir la notice qu'on affiche si elle a déjà été ajoutée dans le DOM ou pas
        if(this.ids.includes(Donnees.indexN)) {
            this.index = this.ids.indexOf(Donnees.indexN);
        }else{
            this.ids.push(Donnees.indexN);
            this.index = this.ids.length-1;
            this.setNoticeEl();
        };
        this.setPosition();
    }
    /** Création d'une notice */
    setNoticeEl(){
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
        this.setDatas(donnees, this.notice.dc, FR.dublin_metas);
        this.setDatas(donnees, this.notice.nema, FR.metas);
        this.setAccordeon(section);

        this.listeNoticesEl.appendChild(section);
    }
    /** Indiquer le mouvement que doivent faire les notices pour afficher la notice qu'il faut */
    setPosition(){
        // this.noticeEl.style.right = 0;
        this.listeNoticesEl.style.left = -(this.noticeEl.offsetWidth * this.index) + 'px' ;
    }
    /**
     * Afficher les informations du document
     * @param {Element} doc Element HTML du document
     */
    setMedia(el:HTMLElement) {
        const ar = document.createElement('article');
        const btn = document.createElement('button');
        btn.className = 'accordeon';
        btn.textContent = FR.media_infos;
        ar.appendChild(btn);
        this.decortiqueObj(this.notice.media, ar);
        el.appendChild(ar);
    }
    /**
     * Afficher les métadonnées
     */
    setDatas(el:HTMLElement, o: any, t: string) {
        const ar = document.createElement('article');
        // const h3 = document.createElement('h3');
        const h3 = document.createElement('button');
        h3.className = 'accordeon';
        h3.textContent = t;
        ar.appendChild(h3);
        this.decortiqueObj(o, ar);
        el.appendChild(ar);
    }
    /**
     * Afficher les séquences d'un document multimédia
     */
    setSequences(el:HTMLElement) {
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
    /**
     * Afficher une vidéo
     * @param {string} url Lien de la vidéo
     * @param {string} f Format de la vidéo
     
    setVideo(url: string, f: string) {
        this.media.appendChild(this.setVideoEl(url, f));
        this.setSequences();
        this.va = document.querySelector('#va');
    }*/
    /**
     * 
     * @param {string} url Adresse du média
     * @param {string} f Format de l'audio
     
    setAudio(url: string, f: string) {
        this.media.appendChild(this.setAudioEl(url, f));
        this.setSequences();
        this.va = document.querySelector('#va');
    }*/
    /**
     * Afficher une image
     * @param {string} url Lien vers le document
     
    setImage(url: string) {
        this.media.appendChild(this.setNoticeImageEl(url));
    }*/
    /**
     * Afficher un fichier PDF
     * @param {string} url Lien vers le document
     
    setPdf(url: string) {
        this.media.appendChild(this.setPdfEL(url));
    }*/
    jumpSequence() {

    }
    setAccordeon(el:HTMLElement) {
        // ACCORDEON
        const acc: HTMLCollection = el.getElementsByClassName("accordeon");
        for (let i = 0; i < acc.length; i++) {
            this.accordeon(acc[i]);
        }
    }
}