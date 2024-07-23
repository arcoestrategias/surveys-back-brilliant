import express from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.routes.js';
import empresaRoutes from './routes/empresas.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import authRoutes from './routes/auth.routes.js';
import estudiosRoutes from './routes/estudios.routes.js';
import accesosEncuestasRoutes from './routes/accesos_encuestas.routes.js'; 
import respuestasArquetiposRoutes from './routes/respuestas_arquetipos.routes.js'; 
import respuestasComportamientosRoutes from './routes/respuestas_comportamientos.routes.js'; 
import respuestasInteresesRoutes from './routes/respuestas_intereses.routes.js'; 


const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Interpretar los json en un objeto javascript
app.use(express.json());

// Middleware para manejo de errores
app.use(async (req, res, next) => {
    try {
        // Las rutas de la aplicación
        app.use('/api/v1', indexRoutes);
        app.use('/api/v1/empresas', empresaRoutes);
        app.use('/api/v1/roles', rolesRoutes);
        app.use('/api/v1/usuarios', usuariosRoutes);
        app.use('/api/v1/auth', authRoutes);
        app.use('/api/v1/estudios', estudiosRoutes);
        app.use('/api/v1/accesos', accesosEncuestasRoutes);
        app.use('/api/v1/arquetipos/respuestas', respuestasArquetiposRoutes);
        app.use('/api/v1/comportamientos/respuestas', respuestasComportamientosRoutes);
        app.use('/api/v1/intereses/respuestas', respuestasInteresesRoutes);

        // Si el endpoint no se encuentra, devolver un error 404
        app.use((req, res) => { 
            res.status(404).json({
                message: 'Endpoint no encontrado'
            });
        });

        next();
    } catch (error) {
        console.log(error)
        next(error);
    }
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack); // Puedes registrar el error en un archivo de logs si lo prefieres
    res.status(500).json({
        message: 'Algo salió mal, por favor intenta de nuevo más tarde.'
    });
});

export default app;
