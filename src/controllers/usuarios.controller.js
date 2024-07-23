import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

// Función para convertir el correo a minúsculas
const toLowerCase = (obj) => {
    if (obj.email) obj.email = obj.email.toLowerCase();
    return obj;
};

// Función para convertir a mayúsculas (sin el correo)
const toUpperCase = (obj) => {
    const fieldsToUpper = ['nombres', 'apellidos', 'cedula', 'genero', 'telefono'];
    fieldsToUpper.forEach(field => {
        if (obj[field]) obj[field] = obj[field].toUpperCase();
    });
    return obj;
};

// Obtener todos los usuarios
export const getUsuarios = async (_, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
    const { id_empresa, id_rol, email, contrasena, nombres, apellidos, cedula, fecha_nacimiento, genero, telefono, es_activo } = req.body;
    try {
        // Convertir el correo a minúsculas y otros campos a mayúsculas
        const usuario = toUpperCase(toLowerCase({
            id_empresa,
            id_rol,
            email,
            nombres,
            apellidos,
            cedula,
            fecha_nacimiento,
            genero,
            telefono,
            es_activo
        }));

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const result = await pool.query(
            `INSERT INTO usuarios (id_empresa, id_rol, email, contrasena, nombres, apellidos, cedula, fecha_nacimiento, genero, telefono, es_activo) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [usuario.id_empresa, usuario.id_rol, usuario.email, hashedPassword, usuario.nombres, usuario.apellidos, usuario.cedula, usuario.fecha_nacimiento, usuario.genero, usuario.telefono, usuario.es_activo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

// Actualizar un usuario por ID
export const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { id_empresa, id_rol, email, contrasena, nombres, apellidos, cedula, fecha_nacimiento, genero, telefono, es_activo } = req.body;

    try {
        // Convertir el correo a minúsculas y otros campos a mayúsculas
        const usuario = toUpperCase(toLowerCase({
            id_empresa,
            id_rol,
            email,
            nombres,
            apellidos,
            cedula,
            fecha_nacimiento,
            genero,
            telefono,
            es_activo
        }));

        let query = `UPDATE usuarios SET id_empresa = $1, id_rol = $2, email = $3, nombres = $4, apellidos = $5, cedula = $6, 
                     fecha_nacimiento = $7, genero = $8, telefono = $9, es_activo = $10, actualizado_en = CURRENT_TIMESTAMP 
                     WHERE id_usuario = $11 RETURNING *`;
        let values = [usuario.id_empresa, usuario.id_rol, usuario.email, usuario.nombres, usuario.apellidos, usuario.cedula, usuario.fecha_nacimiento, usuario.genero, usuario.telefono, usuario.es_activo, id];

        if (contrasena) {
            // Encriptar la nueva contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            query = `UPDATE usuarios SET id_empresa = $1, id_rol = $2, email = $3, contrasena = $4, nombres = $5, apellidos = $6, 
                     cedula = $7, fecha_nacimiento = $8, genero = $9, telefono = $10, es_activo = $11, actualizado_en = CURRENT_TIMESTAMP 
                     WHERE id_usuario = $12 RETURNING *`;
            values = [usuario.id_empresa, usuario.id_rol, usuario.email, hashedPassword, usuario.nombres, usuario.apellidos, usuario.cedula, usuario.fecha_nacimiento, usuario.genero, usuario.telefono, usuario.es_activo, id];
        }

        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario por ID
export const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Usuario eliminado' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};
