import { gsap } from "gsap";
import { CollectionI } from "./models/ModelesI";

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
    /** Ecrire un article des collections */
    setCollectionArticle(c:CollectionI){
        const hr = document.createElement('hr');
        const hrb = document.createElement('hr');
        const a = document.createElement('article');
        const titre = document.createElement('h3');
        titre.textContent = c.titre;

        const descr = document.createElement('p');
        descr.textContent = c.description.length > 200 ? c.description.substring(0, 200)+'...' : c.description;

        a.appendChild(hr);
        a.appendChild(titre);
        a.appendChild(descr);

        // Images
        
        const div = document.createElement('div');
        const aF = document.createElement('a');
        const imgF = document.createElement('img');
        imgF.src = './assets/img/icones/favoris-add.png';
        aF.setAttribute('title', 'Ajouter la collection aux favoris');
        aF.appendChild(imgF);
        div.appendChild(aF);

        const aN = document.createElement('a');
        const imgN = document.createElement('img');
        imgN.src = './assets/img/icones/notices.png';
        aN.setAttribute('title', 'Afficher les notices de cette collection');
        aN.appendChild(imgN);
        div.appendChild(aN);

        aN.addEventListener('click', (e)=>{
            console.log(e.target);
        })
        
        // const aH = document.createElement('a');
        // const img = document.createElement('img');
        // img.src = './assets/img/icones/fleche-haute.png';
        // img.setAttribute('title', 'plus de détail ?');
        // aH.appendChild(img);
        // div.appendChild(aH);

        // Infos
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        if(c.type) {
            li.textContent = "Type : " + c.type;
            ul.appendChild(li);
        }
        if(c.fonds) {
            li.textContent = "Fonds : " + c.fonds;
            ul.appendChild(li);
        }
        if(c.createur) {
            li.textContent = "Créateur : " + c.createur;
            ul.appendChild(li);
        }

        a.appendChild(ul);
        a.appendChild(div);
        a.appendChild(hrb);
        return a;
    }
}