const express = require('express');
const admin = require('../firebase');
const router = express.Router();

// Middleware de autenticación
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
  }
}

router.get('/', verifyToken, async (req, res) => {
  const dni = req.query.dni;
  if (!dni) return res.status(400).json({ error: 'DNI requerido' });

  const userRef = admin.firestore().collection('users').doc(req.user.uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) return res.status(404).json({ error: 'Usuario no encontrado' });

  const user = userSnap.data();
  const now = new Date();

  if (user.plan === 'mensual' && user.vencimiento.toDate() > now) {
    // Plan mensual activo, permitir
  } else if (user.credits > 0) {
    await userRef.update({ credits: admin.firestore.FieldValue.increment(-1) });
  } else {
    return res.status(403).json({ error: 'Sin créditos ni plan activo' });
  }

  // Aquí puedes conectar con tu API real de RENIEC o devolver datos mock
  res.json({
    success: true,
    dni,
    nombres: "Juan Pérez",
    direccion: "Av. Siempre Viva 123",
    validado: true
  });
});

module.exports = router;
