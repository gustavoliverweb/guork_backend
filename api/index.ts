import serverless from "serverless-http";
import app from "../src/app";
import sequelize from "../src/config/database";

let isInitialized = false;
let handler: any;

const initializeDB = async () => {
    if (isInitialized) return;
    
    try {
        console.log("Attempting database connection...");
        await sequelize.authenticate();
        console.log("✅ Database connected successfully (Async Init)");
        isInitialized = true;
    } catch (error) {
        console.error("❌ Database connection failed on Init:", error);
        isInitialized = true; 
    }
};

// **IMPORTANTE**: La promesa de inicialización se inicia aquí, 
// pero NO se espera en el handler principal. Esto evita el timeout.
initializeDB(); // <--- Llamada, pero sin 'await'

// 2. Exportación del handler principal
export default async (req: any, res: any) => {
    // 3. Crear el handler si no existe
    if (!handler) {
        handler = serverless(app);
    }
    
    // 4. Pasamos el control. La DB se conectará asíncronamente en segundo plano.
    // Los endpoints que requieran la DB tendrán que manejar su propio reintento de conexión.
    return handler(req, res);
};
