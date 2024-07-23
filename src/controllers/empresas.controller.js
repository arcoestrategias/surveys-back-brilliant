import { pool } from '../config/db.js';

// Crear una nueva empresa
export const createEmpresa = async (req, res) => {
    const { nombre, es_activo } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO empresas (nombre, es_activo) VALUES ($1, $2) RETURNING *',
            [nombre, es_activo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear empresa:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todas las empresas
export const getEmpresas = async (_, res) => {
    try {
        const result = await pool.query('SELECT * FROM empresas');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener empresas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener una empresa por ID
export const getEmpresaById = async (req, res) => {
    const { id_empresa } = req.params;
    try {
        const result = await pool.query('SELECT * FROM empresas WHERE id_empresa = $1', [id_empresa]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener empresa:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar una empresa por ID
export const updateEmpresa = async (req, res) => {
    const { id_empresa } = req.params;
    const { nombre, es_activo } = req.body;
    try {
        const result = await pool.query(
            'UPDATE empresas SET nombre = $1, es_activo = $2, actualizado_en = CURRENT_TIMESTAMP WHERE id_empresa = $3 RETURNING *',
            [nombre, es_activo, id_empresa]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar empresa:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar una empresa por ID
export const deleteEmpresa = async (req, res) => {
    const { id_empresa } = req.params;
    try {
        const result = await pool.query('DELETE FROM empresas WHERE id_empresa = $1 RETURNING *', [id_empresa]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(200).json({ message: 'Empresa eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar empresa:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
