import { Collections } from './js/Collections.js';
import { Persistance } from './js/data/Persistance.js';

/**
 * Gestion des interactions avec le DOM
 */
window.addEventListener("load", function() {
    // Lancement des classes
    launch();
    // Gestion du menu burger
    document.querySelector('.burger')!.addEventListener('click', (e:any) => {
        e.currentTarget.classList.toggle('croix');
        document.querySelector('main')!.classList.toggle('ouvert');
    });
});
/**
 * Lancer l'application
 */
function launch() {
    let persiste = new Persistance(document.querySelector('body>aside')!, document.querySelector('body>main')!);
    // persiste.getCollections();

    let c = new Collections(document.querySelector('.notices>section'), document.querySelector('.series'), document.getElementById('collections'), document.querySelector('.notice'), document.querySelector('#look'));
};
/** Gestion du bouton de recherche */
// document.querySelector('#cherche')!.addEventListener('click', () => {
//     console.log()
//     document.querySelector('#look')!.classList.toggle('invisible');
// });