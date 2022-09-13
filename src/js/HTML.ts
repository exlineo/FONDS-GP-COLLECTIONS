import { gsap } from "gsap";

export class CustomHTML {
    constructor() { }

    /**
         * Décomposer un objet et ses enfants
         * @param {Object} o Objet présumé à décortiquer
         */
    decortiqueObj(o: any, el:HTMLElement | null=null) {
        const ul = document.createElement('ul');
        ul.className = 'panneau';
        for (let i in o) {
            let li = document.createElement('li');
            if (typeof o[i] == 'object') {
                this.decortiqueObj(o[i], li);
            } else {
                li.innerHTML = `${i} : <strong>${o[i].toString()}</strong>`;
                ul.appendChild(li);
            }
        };
        return el ? ul : el!.appendChild(ul);
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
    /**
     * Afficher une image
     * @param {string} url Lien vers le document
     */
    setImageEl(url: string) {
        const ar = document.createElement('article');
        let img = new Image();
        img.src = url;
        img.className = 'media';
        ar.appendChild(img);
        return ar;
    }
    /**
     * Afficher un fichier PDF
     * @param {string} url Lien vers le document
     */
    setPdfEL(url: string) {
        const ar = document.createElement('article');

        const frame = document.createElement('iframe');
        frame.className = 'media';
        frame.src = url;

        ar.appendChild(frame);
        return ar;
    }
}