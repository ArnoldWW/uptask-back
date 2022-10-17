import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

//crear el app
const app = express();

//Permitir las respuestas json
app.use(express.json());

//Cargar las variables de entorno .env
dotenv.config();

//Conexion a la db
connectDB();

//Habilitar cors
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error CORS"));
    }
  }
};
app.use(cors(corsOptions));

//Rutas
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

//Establecer un puerto para produccion y desarrollo
const PORT = process.env.PORT || 4000;

//Escuchar el servidor en el puerto establecido
app.listen(PORT, () => {
  console.log(`Server running in port http://localhost:${PORT}`);
});
