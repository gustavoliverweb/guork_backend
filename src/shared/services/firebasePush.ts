import * as admin from 'firebase-admin';
import * as path from 'path';
// Usa import dinámico o path absoluto según tu config de TS
const serviceAccount = require(path.resolve(__dirname, "../../config/guork-f47e7-firebase-adminsdk-fbsvc-10b7643e28.json"));

export default class FirebasePushService {

    constructor() {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log("Firebase Admin inicializado correctamente.");
        }
    }
    async sendNotification(token: string, title: string, body: string, data?: any) {
        const message: admin.messaging.Message = {
            notification: {
                title,
                body
            },
            token: token,
            data: data || {}
        };

        try {
            const response = await admin.messaging().send(message);
            return { success: true, response };
        } catch (error) {
            console.error("Error enviando push:", error);
            return { success: false, error };
        }
    }
}