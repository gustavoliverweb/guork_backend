import * as admin from 'firebase-admin';
import * as path from 'path';
// Usa import dinámico o path absoluto según tu config de TS
import 'dotenv/config';
export default class FirebasePushService {

    constructor() {
        if (admin.apps.length === 0) {
            console.log(process.env.JSON_ADMIN_FIREBASE!)
            var keyJson = JSON.parse(process.env.JSON_ADMIN_FIREBASE!);

            if (keyJson.private_key) {
                keyJson.private_key = keyJson.private_key.replace(/\\n/g, '\n') // Reemplaza el texto "\n" por un salto de línea real
                    .replace(/"/g, '');
            }
            console.log(keyJson);
            admin.initializeApp({
                credential: admin.credential.cert(keyJson)
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