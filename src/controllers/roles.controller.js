import { pool } from '../config/db.js';

// Crear un nuevo rol
export const createRol = async (req, res) => {
    const { tipo, es_activo } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO roles (tipo, es_activo) VALUES ($1, $2) RETURNING *`,
            [tipo, es_activo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el rol' });
    }
};

// Obtener todos los roles
export const getRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roles');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los roles' });
    }
};

// Obtener un rol por ID
export const getRolById = async (req, res) => {
    const { id_rol } = req.params;
    try {
        const result = await pool.query('SELECT * FROM roles WHERE id_rol = $1', [id_rol]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el rol' });
    }
};

// Actualizar un rol por ID
export const updateRol = async (req, res) => {
    const { id_rol } = req.params;
    const { tipo, es_activo } = req.body;
    try {
        const result = await pool.query(
            `UPDATE roles SET tipo = $1, es_activo = $2, actualizado_en = CURRENT_TIMESTAMP WHERE id_rol = $3 RETURNING *`,
            [tipo, es_activo, id_rol]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el rol' });
    }
};

// Eliminar un rol por ID
export const deleteRol = async (req, res) => {
    const { id_rol } = req.params;
    try {
        const result = await pool.query('DELETE FROM roles WHERE id_rol = $1 RETURNING *', [id_rol]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json({ message: 'Rol eliminado', rol: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el rol' });
    }
};
