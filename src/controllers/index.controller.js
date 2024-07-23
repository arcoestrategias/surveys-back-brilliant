import { pool } from '../config/db.js';

export const getPing = async (_, res) => {
    try {
        const {rows} = await pool.query("SELECT * FROM usuarios");
        res.json(rows)
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};