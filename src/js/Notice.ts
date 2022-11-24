import { CustomHTML } from "./HTML.js";
import { gsap } from "gsap";
import { NoticeI } from "./models/ModelesI.js";


export class Notice extends CustomHTML {
    metas: any; // Métadonnées de la notice
    n; // Elément HTML
    va: any; // Au cas ou des médias de type vidéo ou audio soient créés
    mediaEl: HTMLElement;
    donneesEl: HTMLElement;
    notice:NoticeI;

    constructor(n: HTMLElement, metas: any) {
        console.log(metas);
        super();
        this.n = n;
        this.mediaEl = n.querySelector('#media')!; // Element HTML pour afficher le média
        this.mediaEl.innerHTML = '';

        this.donneesEl = n.querySelector('#donnees')!; // Element HTML pour lister les données
        this.donneesEl.innerHTML = '';

        this.notice = metas; // Métadonnées de la notice
        // Affichage du titre du document
        const titre = document.createElement('h1');
        titre.textContent = this.notice.dc.title;
        this.mediaEl.appendChild(titre);
        const description = document.createElement('blockquote');
        description.textContent = this.notice.dc.description;

        let f = this.notice.dc.format;
        if (f.indexOf('image') != -1) {
            this.mediaEl.appendChild(this.setNoticeImageEl(this.notice));
        } else if (f.indexOf('video') != -1) {
            this.mediaEl.appendChild(this.setVideoEl(this.notice.media.url, f));
        } else if (f.indexOf('audio') != -1) {
            this.mediaEl.appendChild(this.setAudioEl(this.notice.media.url, f));
        } else {
            this.mediaEl.appendChild(this.setPdfEl(this.notice.media.url));
        }

        // Affichage de la description après le média 
        this.mediaEl.appendChild(description);
        // Afficher les données du média
        this.setMedia();
        // Ecrire les données dans les médias
        this.setDatas(this.notice.dc, "Métadonnées normalisées (Dublin Core)");
        this.setDatas(this.notice.nema, "Métadonnées du document");
        this.setAccordeon();
    }
    /**
     * Afficher les informations du document
     * @param {Element} doc Element HTML du document
     */
    setMedia() {
        const ar = document.createElement('article');
        const btn = document.createElement('button');
        btn.className = 'accordeon';
        btn.textContent = "Informations sur le média";
        ar.appendChild(btn);
        this.decortiqueObj(this.notice.media, ar);
        this.mediaEl.appendChild(ar);
    }
    /**
     * Afficher les métadonnées
     */
    setDatas(o: any, t: string) {
        console.log(o, t);
        const ar = document.createElement('article');
        // const h3 = document.createElement('h3');
        const h3 = document.createElement('button');
        h3.className = 'accordeon';
        h3.textContent = t;
        ar.appendChild(h3);
        this.decortiqueObj(o, ar);
        this.donneesEl.appendChild(ar);
    }
    /**
     * Afficher les séquences d'un document multimédia
     */
    setSequences() {
        console.log(this.notice.nema.sequences);
        if (this.notice.nema.sequences) {
            const s = this.notice.nema.sequences;

            const ar = document.createElement('article');
            const h3 = document.createElement('h3');
            h3.textContent = "Séquences du média";
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
                    console.log(e.currentTarget.dataset.timecode / 1000, this.va);
                    this.va.currentTime = e.currentTarget.dataset.timecode / 1000;
                    this.va.play();
                })
            }
            this.mediaEl.appendChild(ar);
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
    setAccordeon() {
        // ACCORDEON
        const acc = this.n.getElementsByClassName("accordeon");
        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", (e: any) => {
                e.target.classList.toggle("active");
                let pan = e.target.nextElementSibling;
                if (pan.style.maxHeight) {
                    pan.style.maxHeight = null;
                } else {
                    pan.style.maxHeight = pan.scrollHeight + "px";
                }
            });
        }
    }
}