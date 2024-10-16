const admin = require("firebase-admin");
// const serviceAccount = require("./path-to-your-firebase-serviceAccountKey.json");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     // databaseURL: "https://<your-project-id>.firebaseio.com",
});

const verifyIdToken = async (idToken) => {
     try {
          const decodedToken = await admin.auth().verifyIdToken(idToken);
          return decodedToken;
     } catch (error) {
          console.error('Error verifying ID token:', error);
          return null;
     }
};


module.exports = { admin, verifyIdToken };
