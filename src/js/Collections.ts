import { Donnees } from './data/Donnees.js';
import { CollectionI, Collection, FiltreI, NoticeI } from './models/ModelesI.js';
import { CustomHTML } from './HTML.js';
import { Notice } from './Notice.js';

import { FR } from "./trads/fr.js";

export class Collections extends CustomHTML {

    indexC: number = -1; // Index de la collection
    collection: CollectionI = <CollectionI>{};
    notice: any = {};
    seriesEl; // L'entête des notices pour ecrires les séries
    cEl: HTMLElement; // Collection HTML
    f: any; // Champ de filter pour rechercher dans les notices
    lazyImages: Array<HTMLElement> = []; // Liste des éléments HTML recevant un lazyloading
    imagesObserver: any;
    filtres: FiltreI = { libre: '', series: [] };
    templateImg:NodeList;
    /**
     * 
     * @param n La balise pour écrire la liste des notices
     * @param s La balise pour les filtres
     * @param c La balise pour écrire laliste des collections
     * @param o La balise pour la notice en exergue
     * @param f L'input de recherche dans les notices d'une collection
     */
    constructor(s: any, c: any, f: any) {
        super();
        this.seriesEl = s;
        this.cEl = c; // HTML pour écrire la liste des collections
        this.f = f; // Formulaire de recherche

        this.templateImg = document.querySelectorAll('[data-vignettes]');
        // Les collections ont été chargées depuis la base de données
        addEventListener('SET-COLLECTIONS', (e: any) => {
            this.cEl.appendChild(this.setTextEl('h2', FR.COLLECTIONS));
            // Ajouter la description des collections
            e.detail.forEach((c: CollectionI, i: number) => {
                this.cEl.appendChild(this.setCollectionArticle(c, i));
            });
            // Affichage de la première collection de la liste
            console.log("Set collection, init la première", e.detail[0]);
            this.initCollection(e.detail[0]);
        });
        /** Créer les notices une fois les données reçues */
        addEventListener('SET-NOTICES', (e:any) => {
            this.setNotices();
            this.setSeriesFiltre();
        });

        // Filtrer les notices
        this.f.addEventListener('input', () => {
            this.filtres.libre = this.f.value;
            this.filtreNotices();
        });
        /** Interactions sur les boutons du menu pour changer la présentation des notices */
        document.getElementById('lignes')?.addEventListener('click', (e:any) => {
            if(this.noticesEl.className.indexOf('lignes') == -1)  this.noticesEl.className = 'lignes';
        });
        document.getElementById('vignettes')?.addEventListener('click', (e:any) => {
            if(this.noticesEl.className.indexOf('vignettes') == -1)  this.noticesEl.className = 'vignettes';
        });
        document.getElementById('template')?.addEventListener('click', (e:any) => {
            document.body.classList.toggle('contraste');
            this.templateImg.forEach( (i:any) => {
                if(document.body.className == 'contraste'){
                    i.src = i.dataset.lignes;
                }else {
                    i.src = i.dataset.vignettes;
                }
            })
        });
        /** Scroller horizontallement dans la section des notices */
        // this.noticesEl.addEventListener("wheel", (evt) => {
        //     evt.preventDefault();
        //     this.noticesEl.scrollLeft += evt.deltaY;
        // });
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
        this.lazyImages.forEach((image: any) => {
            this.imagesObserver.observe(image);
        });
    }
    /** Afficher les noties et filtres de la collection */
    initCollection(c: any) {
        Donnees.collection = c;
        console.log("Initialisation première collection", Donnees.collection);
        // dispatchEvent(new CustomEvent('GET-NOTICES', { detail: c }));
        dispatchEvent(new CustomEvent('GET-NOTICES'));
    };
    /**
     * Créer les notices à la volée dans le DOM
     */
    setNotices() {
        // Transmettre la collection avec les notices à afficher
        this.lazyImages = []; // Initialisation de la liste des images à suivre dans le load
        this.noticesEl!.innerHTML = '';
        let i = 0;
        // Créer les notices sur l'interface
        Donnees.noticesFiltrees.forEach((n: any, index: number) => {
            // Simplification des métadonnées
            const dc = n.dc;
            const media = n.media;
            const nema = n.nema;

            const url = media.url.indexOf('https://') != -1 && media.url.indexOf('.s3') != -1 ? media.url : `${Donnees.config.g.s3}${nema.set_name}/${media.file}`;
            const ar = document.createElement('article');
            // Figure avec l'image en arriere plan
            const fig = document.createElement('figure');
            fig.className = 'lazy';
            // Identifier la notice
            ar.dataset.i = String(i);
            ++i;
            const div = document.createElement('div');
            const a = document.createElement('a');
            // Adapter l'affichage en fonction du format du document
            if (dc.format) {
                if (dc.format.indexOf('image') != -1) {
                    fig.style.backgroundImage = `url(${url})`;
                } else if (dc.format.indexOf('application') != -1) {
                    fig.style.backgroundImage = `url(assets/img/icones/picto_docs.png)`;
                } else {
                    // let c = document.createElement('div');
                    if (dc.format.indexOf('video') != -1) {
                        fig.innerHTML = this.setVideo(`${url}`, dc.format);
                    } else if (dc.format.indexOf('audio') != -1) {
                        fig.innerHTML = this.setAudio(`${url}`, dc.format);
                    }
                    fig.addEventListener('mouseenter', (e: any) => {
                        e.currentTarget.childNodes[0].play();
                    });
                    fig.addEventListener('mouseleave', (e: any) => {
                        e.currentTarget.childNodes[0].pause();
                    })
                }
            }
            // Ajouter la figure à l'article
            ar.appendChild(fig);
            // Contenu
            const pict = document.createElement('p');
            pict.innerHTML = `<span><img src="assets/img/icones/icone_oeil.svg" alt="${dc.title}" class="icone"></span>`;
            // ar.style.backgroundImage = `url(${media.url})`;
            const p = document.createElement('p');
            p.setAttribute('title', dc.title);
            const resume = 'description' in dc ? `<p>${dc.description.substring(0, dc.description.length > 100 ? 100 : dc.description.length)}...</p>` : '';
            p.innerHTML = `<h4>${dc.title}</h4> ${resume}`;

            a.appendChild(pict);
            div.appendChild(a);
            div.appendChild(p);

            ar.appendChild(div);

            this.noticesEl.appendChild(ar);
            // Ouvrir les détails de la notice cliquée
            ar.addEventListener('click', (e) => {
                this.slide();
                Donnees.indexN = index;
                this.notice = new Notice();
            });
            /** Lazy loading sur les images */
            this.lazyImages.push(fig);
            this.setLazy();
        });
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
        console.log("serie filtrées");
        this.seriesEl.innerHTML = '';
        const h2 = document.createElement('h2');
        // h2.textContent = Donnees.collection.title;
        h2.innerHTML = `<em>(Collection)</em><br>${Donnees.collection.title}`;
        this.seriesEl.appendChild(h2);

        if (Donnees.collection.series!.length > 0) {
            const h4 = document.createElement('h4');
            h4.textContent = FR.filtre_series;
            // Vue ordinateur
            const ul = document.createElement('ul');
            ul.className = 'series';

            // Vue mobile
            const select = document.createElement('select');
            const option = document.createElement('option');
            option.textContent = 'Filtrez par séries';
            option.value = '';
            select.appendChild(option);
            // Select sur mobile pour les séries
            select.addEventListener('change', (e:any)=>{
                console.log(e, e.target.value);
                e.target.value.length > 0 ? this.filtres.series = [e.target.value] : this.filtres.series = [];
                this.filtreNotices();
            });
            // Liste des séries affichées
            Donnees.collection.series!.forEach(d => {
                const li = document.createElement('li');
                const option = document.createElement('option');

                li.textContent = option.textContent = option.value = d;

                li.addEventListener('click', (e: any) => {
                    console.log("Notices filtrées");
                    e.currentTarget.classList.toggle('actif');
                    this.filtres.series.indexOf(d) != -1 ? this.filtres.series.splice(this.filtres.series.indexOf(d), 1) : this.filtres.series.push(d);
                    this.filtreNotices();
                })
                ul.appendChild(li);
                select.appendChild(option);
            });
            
            // this.seriesEl.appendChild(h4);
            this.seriesEl.appendChild(ul);
            this.seriesEl.appendChild(select);
        }
    }
    /** Filtrer les notices de la collection */
    filtreNotices() {
        if (this.filtres.libre.length < 3 && this.filtres.series.length == 0) {
            Donnees.noticesFiltrees = Donnees.notices[Donnees.collection.idcollection];
        } else {
            Donnees.noticesFiltrees = [];
            const libre = this.filtres.libre.toLocaleLowerCase(); // Ramener toutes les recherches en lowercase
            let result = new Set<NoticeI>();
            Donnees.notices[Donnees.collection.idcollection].forEach((n: any) => {
                // Filtres dans les séries sélectionnées
                this.filtres.series.forEach(f => {
                    if (Array.isArray(n.nema.series)) {
                        if (n.nema.series.includes(f)) result.add(n);
                    } else if(typeof n.nema.series === 'string'){
                        if (n.nema.series.indexOf(f) != -1) result.add(n);
                    }
                });
                if (this.filtres.libre.length > 2) {
                    if (n.dc.title && n.dc.title.toLowerCase().indexOf(libre) !== -1) result.add(n);
                    if (n.dc.description && n.dc.description.toLowerCase().indexOf(libre) !== -1) result.add(n);
                    if (n.dc.subject && n.dc.subject.toString().toLowerCase().indexOf(libre) !== -1) result.add(n);
                    if (n.nema.id && n.nema.id.toLowerCase().indexOf(libre) !== -1) result.add(n);
                }
            });
            Donnees.noticesFiltrees = [...result];
            // Sauvegarder la nouvelle liste des notices filtrées dans le localstorage
            localStorage.setItem('noticesFiltrees', JSON.stringify(Donnees.noticesFiltrees));
        };

        // Une fois le tri opéré, afficher les notices
        this.setNotices();
    }
    /** Ecrire un article des collections
     * @param {CollectionI} c Une collection à détailler
     * @param {number} i index de la collection dans la liste des collections (pour la récupérer au clic)
    */
    setCollectionArticle(c: CollectionI, i: number) {
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
        const imgN = this.setImgEl('./assets/img/icones/notices.png')
        aN.setAttribute('title', FR.notices_collec);
        aN.setAttribute('data-i', String(i));
        aN.appendChild(imgN);
        div.appendChild(aN);
        // Cliquer sur l'image des notices pour afficher les notices de la collection
        aN.addEventListener('click', (e:any) => {
            console.log("Coucou clic", e.target, e.currentTarget.parentNode );
            // document.body.dispatchEvent(new Event('onmouseover'));
            // document.body.focus({preventScroll:true});
            // e.currentTarget.parentNode.style.pointerEvents = "none";
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
        gauche!.addEventListener('click', (e) => {
            Donnees.indexN < Donnees.noticesFiltrees.length ? Donnees.indexN++ : Donnees.indexN = 0;
            this.notice.initNotice();
        });
        droite!.addEventListener('click', (e) => {
            Donnees.indexN <= 0 ? Donnees.indexN = Donnees.noticesFiltrees.length - 1 : Donnees.indexN--;
            this.notice.initNotice();
        });
    }
}