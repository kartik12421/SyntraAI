import { cert, getApps, initializeApp } from "firebase-admin/app";
import serviceAccount from "../securityKey.json" with { type: "json" };

export const app =
  getApps()[0] ??
  initializeApp({
    credential: cert(serviceAccount),
  });
