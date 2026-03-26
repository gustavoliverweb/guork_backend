"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
// Usa import dinámico o path absoluto según tu config de TS
require("dotenv/config");
class FirebasePushService {
    constructor() {
        if (admin.apps.length === 0) {
            console.log(process.env.JSON_ADMIN_FIREBASE);
            var keyJson = JSON.parse(process.env.JSON_ADMIN_FIREBASE);
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
    async sendNotification(token, title, body, data) {
        const message = {
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
        }
        catch (error) {
            console.error("Error enviando push:", error);
            return { success: false, error };
        }
    }
}
exports.default = FirebasePushService;
