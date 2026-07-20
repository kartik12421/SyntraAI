import admin from "firebase-admin";
import serviceAccount from "path/to/serviceAccountKey.json" with { type: "json" };

const app = initializeApp({
  credential: cert(serviceAccount),
});
