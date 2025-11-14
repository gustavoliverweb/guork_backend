import serverless from "serverless-http";
import app from "./src/app"; // Ruta corregida para el compilador
import sequelize from "./src/config/database"; // Ruta corregida para el compilador

// 1. Variable global para almacenar el handler de serverless-http
// Se crea de forma síncrona.
const handler = serverless(app);

// 2. Función para intentar la conexión a la DB una vez
const initializeDB = async () => {
    try {
        console.log("Attempting database connection (Fire-and-Forget)...");
        // Intentamos autenticar la conexión a Neon
        await sequelize.authenticate();
        console.log("✅ Database connected successfully (Fire-and-Forget Init)");
    } catch (error) {
        // En caso de fallo, solo logueamos el error, no bloqueamos el servidor
        console.error("❌ Database connection failed on Init:", error);
    }
};

// **IMPORTANTE**: Inicia la conexión inmediatamente.
// NO usamos 'await' aquí para que la función Vercel no espere y evite el timeout.
initializeDB();

// 3. Exportación del handler principal (Síncrona)
// Vercel llama a esta función directamente.
export default handler;
