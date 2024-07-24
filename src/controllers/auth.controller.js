import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { JWT_SECRET } from '../config/config.js';

const saltRounds = 10;

// Función para generar un token JWT
const generateToken = (userId) => {
    return jwt.sign({ id_usuario: userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Función para autenticación de usuario
export const loginUser = async (req, res) => {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }

        // Obtener la empresa a la que pertenece el usuario
        const companyResult = await pool.query('SELECT * FROM empresas WHERE id_empresa = $1', [user.id_empresa]);

        if (companyResult.rows.length === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        const company = companyResult.rows[0];

        // Obtener el código de acceso al estudio del usuario
        const accessResult = await pool.query(`
            SELECT id_estudio, clave_acceso
            FROM accesos_encuestas
            WHERE id_usuario = $1
        `, [user.id_usuario]);

        if (accessResult.rows.length === 0) {
            return res.status(404).json({ message: 'Acceso al estudio no encontrado' });
        }

        const access = accessResult.rows[0];

        // Generar JWT token
        const token = generateToken(user.id_usuario);

        // Responder con el token, información de la empresa, nombre del usuario, id del estudio y código de acceso
        res.json({ 
            // token,
            empresa: {
                id_empresa: company.id_empresa,
                nombre: company.nombre
            },
            nombre_usuario: `${user.nombres} ${user.apellidos}`,
            id_usuaro: user.id_usuario,
            id_estudio: access.id_estudio,
            codigo_acceso: access.clave_acceso
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Función para validar la clave de acceso
export const validateAccessCode = async (req, res) => {
    const { id_usuario, id_estudio, clave_acceso } = req.body;

    // Verificar que se proporcionen todos los datos requeridos
    if (!id_usuario || !id_estudio || !clave_acceso) {
        return res.status(400).json({ message: 'ID de usuario, ID de estudio y clave de acceso son requeridos' });
    }

    try {
        // Obtener el acceso desde la base de datos
        const accessResult = await pool.query(`
            SELECT clave_acceso, arquetipos_completada, comportamientos_completada, intereses_completada
            FROM accesos_encuestas
            WHERE id_usuario = $1 AND id_estudio = $2
        `, [id_usuario, id_estudio]);

        if (accessResult.rows.length === 0) {
            return res.status(404).json({ message: 'Acceso no encontrado' });
        }

        const access = accessResult.rows[0];

        // Validar si la clave de acceso coincide
        if (access.clave_acceso !== clave_acceso) {
            return res.status(401).json({ message: 'Clave de acceso incorrecta' });
        }

        // Devolver el estado de las encuestas
        res.json({
            arquetipos_completada: access.arquetipos_completada,
            comportamientos_completada: access.comportamientos_completada,
            intereses_completada: access.intereses_completada
        });
    } catch (error) {
        console.error('Error en la validación de acceso:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};