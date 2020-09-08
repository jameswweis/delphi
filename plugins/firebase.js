import firebase from "firebase/app";
import "firebase/firestore";

if (!firebase.apps.length) {
  const config = {
    apiKey: "<API KEY GOES HERE>",
    authDomain: "<AUTH DOMAIN GOES HERE>",
    databaseURL: "<DATABASE URL GOES HERE>",
    projectId: "<PROJECT ID GOES HERE>",
    storageBucket: "<STORAGE BUCKET GOES HERE>",
    messagingSenderId: "<MESSAGING SENDER ID GOES HERE>",
    appId: "<APP ID GOES HERE>",
    measurementId: "<MEASUREMENT ID GOES HERE>"
  };
  firebase.initializeApp(config);
  firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
  });
  firebase.firestore().enablePersistence();
}

const db = firebase.firestore();
export { db };
