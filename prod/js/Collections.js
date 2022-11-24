import { Donnees } from './data/Donnees.js';
import { CustomHTML } from './HTML.js';
import { Notice } from './Notice.js';
export class Collections extends CustomHTML {
    constructor(n, s, c, o, f) {
        super(n, o);
        this.indexC = -1; // Index de la collection
        this.indexN = -1; // Index de la notice en cours
        this.collection = {};
        this.notice = {};
        this.lazyImages = []; // Liste des éléments HTML recevant un lazyloading
        this.seriesEl = s;
        this.cEl = c;
        this.f = f;
        // Les collections ont été chargées depuis la base de données
        addEventListener('SET-COLLECTIONS', (e) => {
            e.detail.forEach((c, i) => {
                this.cEl.appendChild(this.setCollectionArticle(c, i));
            });
            // Affichage de la première collection de la liste
            this.collection = e.detail[0];
            dispatchEvent(new CustomEvent('GET-NOTICES', { detail: e.detail[0] }));
        });
        /** Créer les notices une fois les données reçues */
        addEventListener("SET-NOTICES", (e) => this.setNotices(e.detail));
        /**
         * Fermer la notice avec la croix
         */
        this.noticeEl.querySelector('.close').addEventListener('click', () => {
            this.noticeEl.classList.toggle('vu');
            this.notice = {};
        });
        // Filtrer les notices
        this.f.addEventListener('input', () => {
            if (this.f.value.length > 3) {
                this.setNotices(this.filtreNotices(this.f.value));
            }
            else {
                this.setNotices(Donnees.notices);
            }
        });
        /** Ecouteur sur le focus des contenus pour charger ou pas les médias */
        if ("IntersectionObserver" in window) {
            this.imagesObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.classList.remove("lazy");
                        this.imagesObserver.unobserve(image);
                    }
                });
            });
        }
    }
    /** Boucler les éléments HTML pour activer le lazy loading des arrières plans */
    setLazy() {
        this.lazyImages.forEach((image) => {
            this.imagesObserver.observe(image);
        });
    }
    /**
     * Créer les notices à la volée dans le DOM
     */
    setNotices(notices) {
        this.lazyImages = []; // Initialisation de la liste des images à suivre dans le load
        this.noticesEl.innerHTML = '';
        let i = 0;
        // Créer les notices sur l'interface
        notices.forEach((n) => {
            // console.log(n);
            const dc = n.dc;
            const media = n.media;
            const nema = n.nema;
            const url = media.url.indexOf('https://') != -1 ? media.url : `${Donnees.config.g.s3}${nema.set_name}/${media.file}`;
            // const url = `${Donnees.config.g.s3}${nema.set_name}/${media.file}`;
            const ar = document.createElement('article');
            ar.className = 'lazy';
            ar.dataset.i = String(i);
            ++i;
            const a = document.createElement('a');
            // Adapter l'affichage en fonction du format du document
            if (dc.format) {
                if (dc.format.indexOf('image') != -1) {
                    ar.style.backgroundImage = `url(${url})`;
                }
                else if (dc.format.indexOf('application') != -1) {
                    ar.style.backgroundImage = `url(assets/img/icones/picto_docs.png)`;
                }
                else {
                    // let c = document.createElement('div');
                    if (dc.format.indexOf('video') != -1) {
                        a.innerHTML = this.setVideo(`${url}`, dc.format);
                    }
                    else if (dc.format.indexOf('audio') != -1) {
                        a.innerHTML = this.setAudio(`${url}`, dc.format);
                    }
                    a.addEventListener('mouseenter', (e) => {
                        e.currentTarget.childNodes[0].play();
                    });
                    a.addEventListener('mouseleave', (e) => {
                        e.currentTarget.childNodes[0].pause();
                    });
                }
            }
            const pict = document.createElement('p');
            pict.innerHTML = `<span><img src="assets/img/icones/icone_oeil.svg" alt="${dc.title}" class="icone"></span>`;
            // ar.style.backgroundImage = `url(${media.url})`;
            const p = document.createElement('p');
            p.setAttribute('title', dc.title);
            // console.log(dc.hasOwnProperty('description'), dc.hasOwnProperty('description') ? `<span>${dc.description.substring(0, dc.description.length > 100 ? 100 : dc.description.length)}...</span>` : '');
            p.innerHTML = `<h3>${dc.title}</h3>` + dc.hasOwnProperty('description') ? `<span>${dc.description}...</span>` : '';
            a.appendChild(pict);
            ar.appendChild(p);
            ar.appendChild(a);
            this.noticesEl.appendChild(ar);
            // Ouvrir les détails de la notice cliquée
            ar.addEventListener('click', () => {
                this.slide();
                this.indexN = parseInt(ar.dataset.i);
                this.notice = new Notice(this.noticeEl, n);
            });
            /** Lazy loading sur les images */
            this.lazyImages.push(ar);
            this.setLazy();
        });
        // Activer le diaporama des notices
        this.setDiaporama();
        // Afficher les séries de la collection
        this.setSeries();
    }
    /**
     * Activer le diaporama pour faire défiler les notices
     */
    setDiaporama() {
        const gauche = this.noticeEl.querySelector('i.gauche');
        const droite = this.noticeEl.querySelector('i.droite');
        gauche.addEventListener('click', (e) => {
            if (this.indexN > 0) {
                // this.notice = new Notices(this.noticeEl, Donnees.notices[--this.indexN]);
            }
        });
        droite.addEventListener('click', (e) => {
            if (this.indexN < Donnees.notices.length) {
                // this.notice = new Notices(this.noticeEl, Donnees.notices[++this.indexN]);
            }
        });
    }
    /**
     * Renseigner la collection
     */
    setCollection() {
        this.cEl.innerHTML = '';
        const ar = document.createElement('article');
        let details = `
                <h3>${this.collection.title}</h3>
                <p>${this.collection.description}</p>
            `;
        ar.innerHTML = details;
        const u = document.createElement('ul');
        // let li = document.createElement('li');
        let li = `
                <ul>
                    ${this.collection.creator ? `<li>Créateur : ${this.collection.creator}</li>` : null}
                    ${this.collection.funds ? `<li>Fonds : ${this.collection.funds}</li>` : null}
                    ${this.collection.type ? `<li>Type : ${this.collection.type}</li>` : null}
                    ${this.collection.language ? `<li>Langue : ${this.collection.language}</li>` : null}
                </ul>
            `;
        u.innerHTML = li;
        ar.appendChild(u);
        this.cEl.appendChild(ar);
        // this.setSeries();
    }
    /**
     * Afficher les séries de la collection
     */
    setSeries() {
        console.log('Création des séries', this.collection);
        if (this.collection.series && Array.isArray(this.collection.series)) {
            this.seriesEl.innerHTML = ''; // Header de la liste des notices
            const ul = document.createElement('ul');
            const h4 = document.createElement('h4');
            h4.textContent = "Filtrer les notices par séries";
            ul.className = 'series';
            this.collection.series.forEach((s) => {
                let li = document.createElement('li');
                li.textContent = s;
                ul.appendChild(li);
                li.addEventListener('click', () => {
                    this.setNotices(this.setNoticesSeriees(s));
                });
            });
            this.seriesEl.appendChild(h4);
            this.seriesEl.appendChild(ul);
        }
    }
    filtreNotices(filtre) {
        return Donnees.notices.filter((n) => {
            const f = filtre.toLowerCase();
            if (n.dublincore.title && n.dublincore.title.toLowerCase().indexOf(f) !== -1)
                return n;
            if (n.dublincore.description && n.dublincore.description.toLowerCase().indexOf(f) !== -1)
                return n;
            if (n.dublincore.subject && n.dublincore.subject.toString().toLowerCase().indexOf(f) !== -1)
                return n;
        });
        // return Donnees.notices;
    }
    /**
     * Récupérer les notices d'une série
     * @param {string} s Nom de la série servant de tri
     */
    setNoticesSeriees(s) {
        return Donnees.notices.filter((n) => n.nemateria.serie && n.nemateria.serie.serie == s);
    }
    /** Ecrire un article des collections
     * @param {CollectionI} c Une collection à détailler
     * @param {number} i index de la collection dans la liste des collections (pour la récupérer au clic)
    */
    setCollectionArticle(c, i) {
        const hr = this.setTextEl('hr'); // Traits avant et après 
        const hrb = this.setTextEl('hr');
        const a = this.setTextEl('article'); // La collection présentée
        const lien = this.setTextEl('a');
        const titre = this.setTextEl('h3', c.title); // Titre de la collection
        const descr = this.setTextEl('p', c.description.length > 200 ? c.description.substring(0, 200) + '...' : c.description);
        a.appendChild(hr);
        lien.appendChild(titre);
        a.appendChild(lien);
        a.appendChild(descr);
        // Images
        const div = this.setTextEl('div');
        const aF = this.setTextEl('a');
        const pF = this.setTextEl('p', 'Ajouter à vos favoris');
        const imgF = this.setImgEl('./assets/img/icones/favoris-add.png');
        aF.setAttribute('title', 'Ajouter la collection aux favoris');
        // aF.appendChild(pF);
        aF.appendChild(imgF);
        div.appendChild(aF);
        const aN = this.setTextEl('a');
        const pN = this.setTextEl('p', 'Voir les notices');
        pN.textContent = 'Voir les notices';
        const imgN = this.setImgEl('./assets/img/icones/notices.png');
        aN.setAttribute('title', 'Afficher les notices de cette collection');
        aN.setAttribute('data-i', String(i));
        // aN.appendChild(pN);
        aN.appendChild(imgN);
        div.appendChild(aN);
        // Cliquer sur l'image des notices pour afficher les notices de la collection
        aN.addEventListener('click', () => {
            this.collection = c;
            dispatchEvent(new CustomEvent('GET-NOTICES', { detail: c }));
        });
        // Infos
        const ul = this.setTextEl('ul');
        const li = this.setTextEl('li');
        if (c.type) {
            li.textContent = "Type : " + c.type;
            ul.appendChild(li);
        }
        if (c.funds) {
            li.textContent = "Fonds : " + c.funds;
            ul.appendChild(li);
        }
        if (c.creator) {
            li.textContent = "Créateur : " + c.creator;
            ul.appendChild(li);
        }
        a.appendChild(ul);
        a.appendChild(div);
        a.appendChild(hrb);
        return a;
    }
}
