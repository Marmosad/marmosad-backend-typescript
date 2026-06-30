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

// Warn loudly at startup if any Firebase endpoint is missing. An undefined URI
// is the most likely trigger for the request library throwing deep in its auth
// path (e.g. "Username and password required"), so surface it here rather than
// letting it fail cryptically on the first outbound call.
const missingFirebaseEndpoints = [
    {name: "FIREBASE_GET_PACK", value: FIREBASE_GET_PACK},
    {name: "FIREBASE_GET_BLACK_CARD", value: FIREBASE_GET_BLACK_CARD},
    {name: "FIREBASE_GET_WHITE_CARD", value: FIREBASE_GET_WHITE_CARD},
].filter(endpoint => !endpoint.value).map(endpoint => endpoint.name);

if (missingFirebaseEndpoints.length > 0) {
    console.warn("Missing Firebase endpoint configuration: " + missingFirebaseEndpoints.join(", ") +
        ". Outbound card requests will fail until these environment variables are set (loaded from " + path + ").");
}

// FIREBASE_GET_PACK=https://us-central1-marmodb.cloudfunctions.net/getPack
// FIREBASE_GET_BLACK_CARD=https://us-central1-marmodb.cloudfunctions.net/getBlackCard
// FIREBASE_GET_WHITE_CARD=https://us-central1-marmodb.cloudfunctions.net/getWhiteCard
