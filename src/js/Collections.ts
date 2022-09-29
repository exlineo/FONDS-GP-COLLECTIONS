import { Donnees } from './data/Donnees.js';
import { CollectionI, NoticeI } from './models/ModelesI.js';
import { CustomHTML } from './HTML.js';
import { Notice } from './Notice.js';

export class Collections extends CustomHTML {

    indexC: number = -1; // Index de la collection
    indexN: number = -1; // Index de la notice en cours
    collection: any = {};
    notice: any = {};
    sEl; // L'entête des notices pour ecrires les séries
    cEl: HTMLElement; // Collection HTML
    f: any; // Champ de filter pour rechercher dans les notices
    lazyImages:Array<HTMLElement> = []; // Liste des éléments HTML recevant un lazyloading
    imagesObserver:any;

    constructor(n: any, s: any, c: any, o: any, f: any) {
        super(n, o);
        this.sEl = s;
        this.cEl = c;
        this.f = f;
        addEventListener('SET-COLLECTIONS', (e: any) => {
            e.detail.forEach((c:CollectionI, i:number) => {
                this.cEl.appendChild(this.setCollectionArticle(c, i));
            })
        });
        // Créer les notices une fois les données reçues
        addEventListener("SET-NOTICES", (e:any)=>this.setNotices(e.detail));
        /**
         * Fermer la notice avec la croix
         */
        this.noticeEl.querySelector('.notice>i')!.addEventListener('click', () => {
            this.noticeEl.classList.toggle('vu');
            this.notice = null;
        });
        // Filtrer les notices
        this.f.addEventListener('input', () => {
            if (this.f.value.length > 3) {
                this.setNotices(this.filtreNotices(this.f.value));
            } else {
                this.setNotices(Donnees.notices);
            }
        });
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
    setLazy(){
        this.lazyImages.forEach((image: any) => {
            console.log(image);
            this.imagesObserver.observe(image);
        });
    }
    /**
     * Créer les notices à la volée
     */
     setNotices(notices: Array<any>) {
        this.lazyImages = []; // Initialisation de la liste des images à suivre dans le load
        this.noticesEl!.innerHTML = '';
        let i = 0;
        notices.forEach((n:any) => {
            const db = n.dublincore;
            const media = n.media;
            const ar = document.createElement('article');
            ar.className = 'lazy';
            ar.dataset.i = String(i);
            ++i;
            // this.listeObjet(n.metadonnees);
            const a = document.createElement('a');

            // Adapter l'affichage en fonction du format du document
            if (db.format) {
                if (db.format.indexOf('image') != -1) {
                    ar.style.backgroundImage = `url(${Donnees.config.g.s3}${media.url})`;
                } else if (db.format.indexOf('application') != -1) {
                    ar.style.backgroundImage = `url(assets/img/icones/picto_docs.png)`;
                } else {
                    // Ajouter des éléments au 
                    // let c = document.createElement('div');
                    if (db.format.indexOf('video') != -1) {
                        a.innerHTML = this.setVideo(`${Donnees.config.g.s3}media.url`, db.format);
                    } else if (db.format.indexOf('audio') != -1) {
                        a.innerHTML = this.setAudio(`${Donnees.config.g.s3}media.url`, db.format);
                    }
                    // a.appendChild(c);
                    a.addEventListener('mouseenter', (e: any) => {
                        e.currentTarget.childNodes[0].play();
                    });
                    a.addEventListener('mouseleave', (e: any) => {
                        e.currentTarget.childNodes[0].pause();
                    })
                }
            }

            const pict = document.createElement('p');
            pict.innerHTML = `<span><img src="assets/img/icones/icone_oeil.svg" alt="${db.title}" class="icone"></span>`;
            // ar.style.backgroundImage = `url(${media.url})`;
            const p = document.createElement('p');
            p.setAttribute('title', db.title);
            p.innerHTML = `<h3>${db.title}</h3><span>${db.description.substr(0, 100)}...</span>`;

            a.appendChild(pict);
            ar.appendChild(p);
            ar.appendChild(a);
            this.noticesEl!.appendChild(ar);

            ar.addEventListener('click', () => {
                this.slide();
                this.indexN = parseInt(ar.dataset.i!);
                this.notice = new Notice(this.noticeEl, n);
            });
            /** Lazy loading sur les images */
            this.lazyImages.push(ar);
            this.setLazy();
        });
        // Activer le diaporama des notices
        this.setDiaporama();
    }
    /**
     * Activer le diaporama avec les flêches de la notice
     */
     setDiaporama() {
        const gauche = this.noticeEl.querySelector('.fleche.gauche');
        const droite = this.noticeEl.querySelector('.fleche.droite');
        gauche!.addEventListener('click', (e) => {
            console.log(this.indexN);
            if (this.indexN > 0) {
                // this.notice = new Notices(this.noticeEl, Donnees.notices[--this.indexN]);
            }
        });
        droite!.addEventListener('click', (e) => {
            console.log(this.indexN);
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
                ${this.collection.alias ? `<li>Alias : ${this.collection.alias}</li>` : null}
                ${this.collection.idcollections ? `<li>_id : ${this.collection.idcollections}</li>` : null}
                <ul>
                    ${this.collection.creator ? `<li>Créateur : ${this.collection.creator}</li>` : null}
                    ${this.collection.funds ? `<li>Fonds : ${this.collection.funds}</li>` : null}
                    ${this.collection.date ? `<li>Date : ${this.collection.date}</li>` : null}
                    ${this.collection.type ? `<li>Type : ${this.collection.type}</li>` : null}
                    ${this.collection.language ? `<li>Langue : ${this.collection.language}</li>` : null}
                </ul>
            `;

        u.innerHTML = li;
        ar.appendChild(u);
        this.cEl.appendChild(ar);
        this.setSeries();
    }
    /**
     * Afficher les séries de la collection
     */
    setSeries() {
        if (this.collection.series && Array.isArray(this.collection.series)) {
            this.sEl.innerHTML = '';

            const h = document.createElement('header');
            const h1 = document.createElement('h1');
            h1.textContent = "Filtrer par séries";
            h.className = 'jaune';
            h.appendChild(h1);
            this.sEl.appendChild(h);

            const ar = document.createElement('article');
            this.collection.series.forEach((s: any) => {
                let b = document.createElement('button');
                b.textContent = s;
                ar.appendChild(b);
                b.addEventListener('click', () => {
                    this.setNotices(this.setNoticesSeriees(s));
                })
            });
            this.sEl.appendChild(ar);
        }
    }
    
    filtreNotices(filtre: string) {
        return Donnees.notices.filter((n:any) => {
            const f = filtre.toLowerCase();
            if (n.dublincore.title && n.dublincore.title.toLowerCase().indexOf(f) !== -1) return n;
            if (n.dublincore.description && n.dublincore.description.toLowerCase().indexOf(f) !== -1) return n;
            if (n.dublincore.subject && n.dublincore.subject.toString().toLowerCase().indexOf(f) !== -1) return n;
        });
        return Donnees.notices;
    }
    /**
     * Récupérer les notices d'une série
     * @param {string} s Nom de la série servant de tri
     */
    setNoticesSeriees(s: string) {
        return Donnees.notices.filter((n:any) => n.nemateria.serie && n.nemateria.serie.serie == s);
    }
    /** Ecrire un article des collections
     * @param {CollectionI} c Une collection à détailler
     * @param {number} i index de la collection dans la liste des collections (pour la récupérer au clic)
    */
    setCollectionArticle(c:CollectionI, i:number){
        const hr = this.setTextEl('hr');
        const hrb = this.setTextEl('hr');
        const a = this.setTextEl('article');
        const lien = this.setTextEl('a');
        const titre = this.setTextEl('h3', c.title);

        const descr = this.setTextEl('p', c.description.length > 200 ? c.description.substring(0, 200)+'...' : c.description);

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
        const imgN = this.setImgEl('./assets/img/icones/notices.png')
        aN.setAttribute('title', 'Afficher les notices de cette collection');
        aN.setAttribute('data-i', String(i));
        // aN.appendChild(pN);
        aN.appendChild(imgN);
        div.appendChild(aN);
        // Cliquer sur l'image des notices pour afficher les notices de la collection
        aN.addEventListener('click', ()=>{
            dispatchEvent(new CustomEvent('GET-NOTICES', {detail:c}))
        });

        // Infos
        const ul = this.setTextEl('ul');
        const li = this.setTextEl('li');
        if(c.type) {
            li.textContent = "Type : " + c.type;
            ul.appendChild(li);
        }
        if(c.fund) {
            li.textContent = "Fonds : " + c.fund;
            ul.appendChild(li);
        }
        if(c.creator) {
            li.textContent = "Créateur : " + c.creator;
            ul.appendChild(li);
        }

        a.appendChild(ul);
        a.appendChild(div);
        a.appendChild(hrb);
        return a;
    }
}