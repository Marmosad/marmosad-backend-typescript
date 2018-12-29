import * as dotenv from "dotenv";

dotenv.config();
let path;
let env;
switch (process.env.NODE_ENV) {
    case "test":
        path = `${__dirname}../.env.test`;
        env='TEST';
        break;
    case "production":
        path = `${__dirname}/../.env`;
        env='PROD';
        break;
    case "devel":
        path = `${__dirname}/../.env.development`;
        env='DEV';
        break;
    default:
        path = `${__dirname}/../.env.development`;
}
console.log(path);
require('dotenv').config({path: path});

export const FIREBASE_GET_PACK = process.env.FIREBASE_GET_PACK;
export const FIREBASE_GET_BLACK_CARD = process.env.FIREBASE_GET_BLACK_CARD;
export const FIREBASE_GET_WHITE_CARD = process.env.FIREBASE_GET_WHITE_CARD;
export const PORT = process.env.PORT;
export const ENV = env;

// FIREBASE_GET_PACK=https://us-central1-marmodb.cloudfunctions.net/getPack
// FIREBASE_GET_BLACK_CARD=https://us-central1-marmodb.cloudfunctions.net/getBlackCard
// FIREBASE_GET_WHITE_CARD=https://us-central1-marmodb.cloudfunctions.net/getWhiteCard
