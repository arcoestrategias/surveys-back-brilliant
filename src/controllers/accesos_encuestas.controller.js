// src/controllers/accesos_encuestas.controller.js
import { pool } from '../config/db.js';

// Validar existencia del usuario
const validateUsuario = async (id_usuario) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario]);
    return result.rows.length > 0;
};

// Validar existencia del estudio
const validateEstudio = async (id_estudio) => {
    const result = await pool.query('SELECT * FROM estudios WHERE id_estudio = $1', [id_estudio]);
    return result.rows.length > 0;
};

// Obtener todos los accesos
export const getAccesosEncuestas = async (_, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM accesos_encuestas');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener accesos' });
    }
};

// Obtener un acceso por ID
export const getAccesoEncuestaById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM accesos_encuestas WHERE id_acceso = $1', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Acceso no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el acceso' });
    }
};

// Crear un nuevo acceso
export const createAccesoEncuesta = async (req, res) => {
    const { id_usuario, id_estudio, clave_acceso, arquetipos_completada, comportamientos_completada, intereses_completada, es_activo } = req.body;
    try {
        // Verificar si el usuario y el estudio existen
        if (!await validateUsuario(id_usuario)) {
            return res.status(400).json({ message: 'Usuario no existe' });
        }

        if (!await validateEstudio(id_estudio)) {
            return res.status(400).json({ message: 'Estudio no existe' });
        }

        const result = await pool.query(
            `INSERT INTO accesos_encuestas (id_usuario, id_estudio, clave_acceso, arquetipos_completada, comportamientos_completada, intereses_completada, es_activo) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [id_usuario, id_estudio, clave_acceso, arquetipos_completada, comportamientos_completada, intereses_completada, es_activo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el acceso' });
    }
};

// Actualizar un acceso por ID
export const updateAccesoEncuesta = async (req, res) => {
    const { id } = req.params;
    const { id_usuario, id_estudio, clave_acceso, arquetipos_completada, comportamientos_completada, intereses_completada, es_activo } = req.body;
    
    try {
        // Verificar si el usuario y el estudio existen
        if (id_usuario && !await validateUsuario(id_usuario)) {
            return res.status(400).json({ message: 'Usuario no existe' });
        }

        if (id_estudio && !await validateEstudio(id_estudio)) {
            return res.status(400).json({ message: 'Estudio no existe' });
        }

        let query = `UPDATE accesos_encuestas SET id_usuario = $1, id_estudio = $2, clave_acceso = $3, arquetipos_completada = $4, 
                     comportamientos_completada = $5, intereses_completada = $6, es_activo = $7, actualizado_en = CURRENT_TIMESTAMP 
                     WHERE id_acceso = $8 RETURNING *`;
        let values = [id_usuario, id_estudio, clave_acceso, arquetipos_completada, comportamientos_completada, intereses_completada, es_activo, id];

        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Acceso no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el acceso' });
    }
};

// Eliminar un acceso por ID
export const deleteAccesoEncuesta = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM accesos_encuestas WHERE id_acceso = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Acceso eliminado' });
        } else {
            res.status(404).json({ message: 'Acceso no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el acceso' });
    }
};

// Obtener accesos por id_usuario y id_estudio
export const getAccesosPorUsuarioYEstudio = async (req, res) => {
    const { id_usuario, id_estudio } = req.params;

    try {
        // Verificar si el usuario y el estudio existen
        if (!await validateUsuario(id_usuario)) {
            return res.status(400).json({ message: 'Usuario no existe' });
        }

        if (!await validateEstudio(id_estudio)) {
            return res.status(400).json({ message: 'Estudio no existe' });
        }

        const { rows } = await pool.query(
            'SELECT * FROM accesos_encuestas WHERE id_usuario = $1 AND id_estudio = $2',
            [id_usuario, id_estudio]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener accesos' });
    }
};
