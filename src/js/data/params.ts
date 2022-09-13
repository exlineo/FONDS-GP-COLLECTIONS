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
    setPOST: (b:any) => {
        return {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            body: b
        }
    },
    // Liste des liens pour la gestion des collections et des notices (on gardera que le get à la fin, c'est pour garder)
    CONFIG : 'https://g7xgiofn44fwuwpcvo352mzqdq0ikjoa.lambda-url.eu-west-3.on.aws/'
};
export default PARAMS;