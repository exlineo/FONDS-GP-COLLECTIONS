import * as AWS from 'aws-sdk';
// Récupérer la variable d'environnement créée par le CDK
const DB_T_NAME = process.env.DB_T_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';
// Accès à la base de données
const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any = {}): Promise<any> => {

  let body: any = null;

  /** Vérifier que des données ont été envoyées */
  if (!event.body) {
    return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
  } else {
    body = JSON.parse(event.body);
  }
  const expressions: Array<string> = [];
  const values: any = {};
  for (let i in body) {
    if (i != PRIMARY_KEY) {
      expressions.push(`${i} = :${i}`);
      values[`:${i}`] = body[i];
    }
  }
  const expression = 'set ' + expressions.join();

  // Paramètres transmis dans la requête vers DynamoDB
  const params: any = {
    TableName: DB_T_NAME,
    Key: {
      [PRIMARY_KEY]: body[PRIMARY_KEY]
    },
    UpdateExpression: expression,
    ExpressionAttributeValues: values,
    ReturnValues: 'UPDATED_NEW'
  }
  // Requête vers DynamoDB
  try {
    const response = await db.update(params).promise();
    return { statusCode: 204, body: 'Données modifiées' };
  } catch (er: any) {
    // const errorResponse = er.code === 'ValidationException' && er.message.includes('reserved keyword') ?
    // DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
    return { statusCode: 500, body: JSON.stringify(er) };
  }

}