import { pool } from '../config/db.js';

// Obtener todos los estudios
export const getEstudios = async (_, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM estudios');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener estudios' });
    }
};

// Obtener un estudio por ID
export const getEstudioById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM estudios WHERE id_estudio = $1', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Estudio no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el estudio' });
    }
};

// Crear un nuevo estudio
export const createEstudio = async (req, res) => {
    const { id_empresa, nombre, descripcion, fecha_estudio, finalizado, es_arquetipo, es_comportamiento, es_interes, es_activo } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO estudios (id_empresa, nombre, descripcion, fecha_estudio, finalizado, es_arquetipo, es_comportamiento, es_interes, es_activo) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [id_empresa, nombre, descripcion, fecha_estudio, finalizado, es_arquetipo, es_comportamiento, es_interes, es_activo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el estudio' });
    }
};

// Actualizar un estudio por ID
export const updateEstudio = async (req, res) => {
    const { id } = req.params;
    const { id_empresa, nombre, descripcion, fecha_estudio, finalizado, es_arquetipo, es_comportamiento, es_interes, es_activo } = req.body;

    try {
        const result = await pool.query(
            `UPDATE estudios SET id_empresa = $1, nombre = $2, descripcion = $3, fecha_estudio = $4, finalizado = $5, es_arquetipo = $6, 
             es_comportamiento = $7, es_interes = $8, es_activo = $9, actualizado_en = CURRENT_TIMESTAMP 
             WHERE id_estudio = $10 RETURNING *`,
            [id_empresa, nombre, descripcion, fecha_estudio, finalizado, es_arquetipo, es_comportamiento, es_interes, es_activo, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Estudio no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el estudio' });
    }
};

// Eliminar un estudio por ID
export const deleteEstudio = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM estudios WHERE id_estudio = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Estudio eliminado' });
        } else {
            res.status(404).json({ message: 'Estudio no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el estudio' });
    }
};
