import { pool } from '../config/db.js';

// Crear nuevas respuestas de intereses
export const createRespuestasIntereses = async (req, res) => {
    const { id_usuario, id_estudio, grupos } = req.body;

    if (!id_usuario) {
        return res.status(400).json({ message: 'El id_usuario es requerido' });
    }
    if (!id_estudio) {
        return res.status(400).json({ message: 'El id_estudio es requerido' });
    }
    if (!Array.isArray(grupos) || grupos.length === 0) {
        return res.status(400).json({ message: 'La lista de grupos no puede estar vacía' });
    }

    try {
        // Verificar si el usuario ha completado ya la encuesta de intereses
        const checkCompletion = await pool.query(`
            SELECT intereses_completada
            FROM accesos_encuestas
            WHERE id_usuario = $1 AND id_estudio = $2
        `, [id_usuario, id_estudio]);

        if (checkCompletion.rows.length === 0) {
            return res.status(404).json({ message: 'Acceso al estudio no encontrado para el usuario' });
        }

        if (checkCompletion.rows[0].intereses_completada) {
            return res.status(400).json({ message: 'La encuesta de intereses ya ha sido completada anteriormente' });
        }

        // Insertar respuestas en la tabla respuestas_intereses
        for (const grupo of grupos) {
            const { id_grupo, orden_palabras } = grupo;
            await pool.query(`
                INSERT INTO respuestas_intereses (id_usuario, id_estudio, id_grupo, orden_1, orden_2, orden_3, orden_4, orden_5, orden_6)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [id_usuario, id_estudio, id_grupo, orden_palabras[0], orden_palabras[1], orden_palabras[2], orden_palabras[3], orden_palabras[4], orden_palabras[5]]);
        }

        // Actualizar el estado de intereses_completada en la tabla accesos_encuestas
        await pool.query(`
            UPDATE accesos_encuestas
            SET intereses_completada = true
            WHERE id_usuario = $1 AND id_estudio = $2
        `, [id_usuario, id_estudio]);

        res.json({ message: 'Encuesta guardada con éxito' });
    } catch (error) {
        console.error('Error al guardar respuestas de intereses:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todas las respuestas de intereses
export const getAllRespuestasIntereses = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM respuestas_intereses');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener respuestas de intereses:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener una respuesta de intereses por ID
export const getRespuestaInteresById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM respuestas_intereses WHERE id_respuesta_interes = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Respuesta de intereses no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener respuesta de intereses:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar una respuesta de intereses por ID
export const updateRespuestaInteresById = async (req, res) => {
    const { id } = req.params;
    const { id_usuario, id_estudio, id_grupo, orden_1, orden_2, orden_3, orden_4, orden_5, orden_6, es_activo } = req.body;

    try {
        const result = await pool.query(`
            UPDATE respuestas_intereses
            SET id_usuario = $1, id_estudio = $2, id_grupo = $3, orden_1 = $4, orden_2 = $5, orden_3 = $6, orden_4 = $7, orden_5 = $8, orden_6 = $9, es_activo = $10, actualizado_en = CURRENT_TIMESTAMP
            WHERE id_respuesta_interes = $11
            RETURNING *
        `, [id_usuario, id_estudio, id_grupo, orden_1, orden_2, orden_3, orden_4, orden_5, orden_6, es_activo, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Respuesta de intereses no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar respuesta de intereses:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar una respuesta de intereses por ID
export const deleteRespuestaInteresById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM respuestas_intereses WHERE id_respuesta_interes = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Respuesta de intereses no encontrada' });
        }
        res.json({ message: 'Respuesta de intereses eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar respuesta de intereses:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
