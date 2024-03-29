const PARAMS = {
    SERV: "http://vps550598.ovh.net/nemateriarest/",
    // Entête des requêtes
    HEAD: {
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    },
    // Envoyer des données
    setPOST: (b) => {
        return {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            body: b
        };
    },
    // Liste des liens pour la gestion des collections et des notices (on gardera que le get à la fin, c'est pour garder)
    CONFIG: './assets/data/config.json',
};
export default PARAMS;
