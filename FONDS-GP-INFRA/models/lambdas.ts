import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export interface LambdaI {
    name: string;
    file: string;
    lambda?: NodejsFunction;
    table:string;
    methods:Array<any>;
    origins?:Array<string>;
}
interface LambdasStackI{
    db?:Table;
    lambdas:Array<LambdaI>;
}
const listeCollectionsLambdas:Array<LambdaI> = [
    { name: 'collections-getall', file: 'collections-getall.ts', table:'collections', methods:['GET', 'HEAD'] },
    { name: 'collections-post', file: 'collections-post.ts', table:'collections', methods:['POST', 'PUT'] },
    { name: 'collections-add', file: 'collections-add.ts', table:'collections', methods:['POST']  },
    { name: 'collections-delete', file: 'collections-delete.ts', table:'collections', methods:['DELETE']}
]

export const collectionsStack:LambdasStackI = {
    lambdas : listeCollectionsLambdas
}