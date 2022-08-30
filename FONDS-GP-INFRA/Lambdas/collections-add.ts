import * as AWS from 'aws-sdk';
// Récupérer la variable d'environnement créée par le CDK
const DB_T_NAME = process.env.DB_T_NAME || '';
// Accès à la base de données
const db = new AWS.DynamoDB.DocumentClient();

export const handler = async(event:any={}):Promise<any> => {
  // Paramètres transmis dans la requête vers DynamoDB
  const params = {
    TableName: DB_T_NAME
  };
  // Requête vers DynamoDB
  try {
    const response = await db.scan(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (er) {
    return { statusCode: 500, body: JSON.stringify(er) };
  }

}