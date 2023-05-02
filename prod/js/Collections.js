import { Donnees } from './data/Donnees.js';
import { CustomHTML } from './HTML.js';
import { Notice } from './Notice.js';
import { FR } from "./trads/fr.js";
export class Collections extends CustomHTML {
    /**
     *
     * @param n La balise pour écrire la liste des notices
     * @param s La balise pour les filtres
     * @param c La balise pour écrire laliste des collections
     * @param o La balise pour la notice en exergue
     * @param f L'input de recherche dans les notices d'une collection
     */
    constructor(s, c, f) {
        super();
        this.indexC = -1; // Index de la collection
        this.collection = {};
        this.notice = {};
        this.lazyImages = []; // Liste des éléments HTML recevant un lazyloading
        this.filtres = { libre: '', series: [] };
        this.seriesEl = s;
        this.cEl = c; // HTML pour écrire la liste des collections
        this.f = f; // Formulaire de recherche
        console.log("Séries", this.seriesEl);
        // Les collections ont été chargées depuis la base de données
        addEventListener('SET-COLLECTIONS', (e) => {
            this.cEl.appendChild(this.setTextEl('h2', FR.COLLECTIONS));
            // Ajouter la description des collections
            e.detail.forEach((c, i) => {
                this.cEl.appendChild(this.setCollectionArticle(c, i));
            });
            // Affichage de la première collection de la liste
            this.initCollection(e.detail[0]);
        });
        /** Créer les notices une fois les données reçues */
        addEventListener('SET-NOTICES', (e) => this.setNotices());
        // Filtrer les notices
        this.f.addEventListener('input', () => {
            this.filtres.libre = this.f.value;
            this.filtreNotices();
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
        // Diaporama
        this.setDiaporama();
    }
    /** Boucler les éléments HTML pour activer le lazy loading des arrières plans */
    setLazy() {
        this.lazyImages.forEach((image) => {
            this.imagesObserver.observe(image);
        });
    }
    /** Afficher les noties et filtres de la collection */
    initCollection(c) {
        Donnees.collection = c;
        dispatchEvent(new CustomEvent('GET-NOTICES', { detail: c }));
    }
    ;
    /**
     * Créer les notices à la volée dans le DOM
     */
    setNotices() {
        // Transmettre la collection avec les notices à afficher
        this.lazyImages = []; // Initialisation de la liste des images à suivre dans le load
        this.noticesEl.innerHTML = '';
        let i = 0;
        // Créer les notices sur l'interface
        Donnees.noticesFiltrees.forEach((n, index) => {
            const dc = n.dc;
            const media = n.media;
            const nema = n.nema;
            const url = media.url.indexOf('https://') != -1 && media.url.indexOf('.s3') != -1 ? media.url : `${Donnees.config.g.s3}${nema.set_name}/${media.file}`;
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
            const resume = 'description' in dc ? `<p>${dc.description.substring(0, dc.description.length > 100 ? 100 : dc.description.length)}...</p>` : '';
            p.innerHTML = `<h4>${dc.title}</h4> ${resume}`;
            a.appendChild(pict);
            ar.appendChild(a);
            ar.appendChild(p);
            this.noticesEl.appendChild(ar);
            // Ouvrir les détails de la notice cliquée
            ar.addEventListener('click', (e) => {
                this.slide();
                Donnees.indexN = index;
                this.notice = new Notice();
            });
            /** Lazy loading sur les images */
            this.lazyImages.push(ar);
            this.setLazy();
        });
        // Afficher les séries de la collection
        this.setSeriesFiltre();
        this.deload();
    }
    /**
     * Renseigner la collection
     */
    setCollection() {
        this.cEl.innerHTML = '';
        const ar = document.createElement('article');
        let details = `
                <h3>${Donnees.collection.title}</h3>
                <p>${Donnees.collection.description}</p>
            `;
        ar.innerHTML = details;
        const u = document.createElement('ul');
        // let li = document.createElement('li');
        let li = `
                <ul>
                    ${Donnees.collection.creator ? `<li>${FR.creator} : ${Donnees.collection.creator}</li>` : null}
                    ${Donnees.collection.funds ? `<li>${FR.collection_funds} : ${Donnees.collection.funds}</li>` : null}
                    ${Donnees.collection.type ? `<li>${FR.type} : ${Donnees.collection.type}</li>` : null}
                    ${Donnees.collection.language ? `<li>${FR.language} : ${Donnees.collection.language}</li>` : null}
                </ul>
            `;
        u.innerHTML = li;
        ar.appendChild(u);
        this.cEl.appendChild(ar);
    }
    /** Créer une liste de séries cliquables */
    setSeriesFiltre() {
        this.seriesEl.innerHTML = '';
        if (Donnees.collection.series.length > 0) {
            const h4 = document.createElement('h4');
            h4.textContent = FR.filtre_series;
            const ul = document.createElement('ul');
            ul.className = 'series';
            Donnees.collection.series.forEach(d => {
                const li = document.createElement('li');
                li.textContent = d;
                li.addEventListener('click', (e) => {
                    e.currentTarget.classList.toggle('actif');
                    this.filtres.series.indexOf(d) != -1 ? this.filtres.series.splice(this.filtres.series.indexOf(d), 1) : this.filtres.series.push(d);
                    this.filtreNotices();
                });
                ul.appendChild(li);
            });
            // this.seriesEl.appendChild(h4);
            this.seriesEl.appendChild(ul);
        }
    }
    /** Filtrer les notices de la collection */
    filtreNotices() {
        if (this.filtres.libre.length < 3 && this.filtres.series.length == 0) {
            Donnees.noticesFiltrees = Donnees.notices[Donnees.collection.idcollections];
        }
        else {
            Donnees.noticesFiltrees = [];
            const libre = this.filtres.libre.toLocaleLowerCase(); // Ramener toutes les recherches en lowercase
            let result = new Set();
            Donnees.notices[Donnees.collection.idcollections].forEach((n) => {
                // Filtres dans les séries sélectionnées
                this.filtres.series.forEach(f => {
                    if (Array.isArray(n.nema.series)) {
                        if (n.nema.series.includes(f))
                            result.add(n);
                    }
                    else {
                        if (n.nema.series.indexOf(f) != -1)
                            result.add(n);
                    }
                });
                if (this.filtres.libre.length > 2) {
                    if (n.dc.title && n.dc.title.toLowerCase().indexOf(libre) !== -1)
                        result.add(n);
                    if (n.dc.description && n.dc.description.toLowerCase().indexOf(libre) !== -1)
                        result.add(n);
                    if (n.dc.subject && n.dc.subject.toString().toLowerCase().indexOf(libre) !== -1)
                        result.add(n);
                    if (n.nema.id && n.nema.id.toLowerCase().indexOf(libre) !== -1)
                        result.add(n);
                }
            });
            Donnees.noticesFiltrees = [...result];
        }
        ;
        // Une fois le tri opérer, afficher les notices
        this.setNotices();
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
        const pF = this.setTextEl('p', FR.favoris);
        const imgF = this.setImgEl('./assets/img/icones/favoris-add.png');
        aF.setAttribute('title', FR.favoris_add);
        // aF.appendChild(pF);
        aF.appendChild(imgF);
        div.appendChild(aF);
        const aN = this.setTextEl('a');
        const pN = this.setTextEl('p', FR.notices_view);
        pN.textContent = FR.notices_view;
        const imgN = this.setImgEl('./assets/img/icones/notices.png');
        aN.setAttribute('title', FR.notices_collec);
        aN.setAttribute('data-i', String(i));
        // aN.appendChild(pN);
        aN.appendChild(imgN);
        div.appendChild(aN);
        // Cliquer sur l'image des notices pour afficher les notices de la collection
        aN.addEventListener('click', () => {
            this.initCollection(c);
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
    /** Activer le diaporama pour faire défiler les notices */
    setDiaporama() {
        const gauche = document.querySelector('.arrowleft');
        const droite = document.querySelector('.arrowright');
        gauche.addEventListener('click', (e) => {
            Donnees.indexN < Donnees.noticesFiltrees.length ? Donnees.indexN++ : Donnees.indexN = 0;
            this.notice.initNotice();
        });
        droite.addEventListener('click', (e) => {
            Donnees.indexN <= 0 ? Donnees.indexN = Donnees.noticesFiltrees.length - 1 : Donnees.indexN--;
            this.notice.initNotice();
        });
    }
}
