import { pool } from '../config/db.js';

// Obtener todas las respuestas de arquetipos
export const getRespuestasArquetipos = async (_, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM respuestas_arquetipos');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener respuestas de arquetipos:', error);
        res.status(500).json({ message: 'Error al obtener respuestas de arquetipos' });
    }
};

// Obtener una respuesta de arquetipo por ID
export const getRespuestaArquetipoById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM respuestas_arquetipos WHERE id_respuesta_arquetipo = $1', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Respuesta de arquetipo no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener respuesta de arquetipo:', error);
        res.status(500).json({ message: 'Error al obtener respuesta de arquetipo' });
    }
};

// Crear respuestas de arquetipos
export const createRespuestasArquetipos = async (req, res) => {
    const { id_usuario, id_estudio, encuesta } = req.body;

    if (!id_usuario) {
        return res.status(400).json({ message: 'El ID del usuario es requerido' });
    }
    if (!id_estudio) {
        return res.status(400).json({ message: 'El ID del estudio es requerido' });
    }
    if (!encuesta || encuesta.length === 0) {
        return res.status(400).json({ message: 'La lista de preguntas no puede estar vacía' });
    }

    try {
        // Verificar si el usuario ya completó la encuesta
        const accesoResult = await pool.query('SELECT * FROM accesos_encuestas WHERE id_usuario = $1 AND id_estudio = $2', [id_usuario, id_estudio]);
        if (accesoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Acceso no encontrado' });
        }
        
        const acceso = accesoResult.rows[0];
        if (acceso.arquetipos_completada) {
            return res.status(400).json({ message: 'La encuesta ya ha sido completada anteriormente' });
        }

        // Insertar respuestas
        const insertQueries = encuesta.map(({ pregunta, respuesta }) => ({
            text: 'INSERT INTO respuestas_arquetipos (id_usuario, id_pregunta, respuesta) VALUES ($1, $2, $3)',
            values: [id_usuario, pregunta, respuesta]
        }));

        // Ejecutar todas las consultas de inserción
        for (const query of insertQueries) {
            await pool.query(query.text, query.values);
        }

        // Actualizar el estado en accesos_encuestas
        await pool.query('UPDATE accesos_encuestas SET arquetipos_completada = TRUE WHERE id_usuario = $1 AND id_estudio = $2', [id_usuario, id_estudio]);

        res.json({ message: 'Encuesta guardada con éxito' });
    } catch (error) {
        console.error('Error al guardar la encuesta:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar una respuesta de arquetipo por ID
export const updateRespuestaArquetipo = async (req, res) => {
    const { id } = req.params;
    const { id_usuario, id_pregunta, respuesta, id_estudio } = req.body;

    if (!id_usuario || !id_pregunta || !respuesta || !id_estudio) {
        return res.status(400).json({ message: 'Faltan datos para actualizar la respuesta de arquetipo' });
    }

    try {
        const result = await pool.query(
            `UPDATE respuestas_arquetipos 
             SET id_usuario = $1, id_pregunta = $2, respuesta = $3, id_estudio = $4, actualizado_en = CURRENT_TIMESTAMP 
             WHERE id_respuesta_arquetipo = $5 RETURNING *`,
            [id_usuario, id_pregunta, respuesta, id_estudio, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Respuesta de arquetipo no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar respuesta de arquetipo:', error);
        res.status(500).json({ message: 'Error al actualizar respuesta de arquetipo' });
    }
};

// Eliminar una respuesta de arquetipo por ID
export const deleteRespuestaArquetipo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM respuestas_arquetipos WHERE id_respuesta_arquetipo = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Respuesta de arquetipo eliminada' });
        } else {
            res.status(404).json({ message: 'Respuesta de arquetipo no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar respuesta de arquetipo:', error);
        res.status(500).json({ message: 'Error al eliminar respuesta de arquetipo' });
    }
};
