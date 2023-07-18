import { CustomHTML } from '../common/HTML.js';
export class NemaPlayer extends CustomHTML {
    constructor() {
        super();
    }
    ;
    /** Web component initiate */
    connectedCallback() {
        // this.setInit();
        this.params = this.dataset.params;
        this.targetEl = document.getElementById(this.params.target);
        this.init();
    }
    ;
    /** Create the HTMLElement */
    init() {
        let f = this.store.notice.dc.format;
        if (f.indexOf('video') != -1) {
            this.targetEl.appendChild(this.setVideoEl(this.store.notice.media.url, f));
        }
        else if (f.indexOf('audio') != -1) {
            this.targetEl.appendChild(this.setAudioEl(this.store.notice.media.url, f));
        }
    }
    /** Afficher les séquences d'un document multimédia */
    setSequences(el) {
        if (this.store.notice.nema.sequences) {
            const s = this.store.notice.nema.sequences;
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
                a.setAttribute('data-timecode', time[i].trim());
                ar.appendChild(a);
                a.addEventListener('click', (e) => {
                    this.va.currentTime = e.currentTarget.dataset.timecode / 1000;
                    this.va.play();
                });
            }
            el.appendChild(ar);
        }
    }
}
/** Define WebComponent */
customElements.define('nema-player', NemaPlayer);
