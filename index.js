const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Ruta para buscar por DNI
app.get('/reniec', async (req, res) => {
  const dni = req.query.dni;
  if (!dni) return res.status(400).json({ error: 'El DNI es obligatorio' });

  try {
    const response = await axios.get(`https://api.apis.net.pe/v1/dni?numero=${dni}`, {
      headers: {
        'Referer': 'https://apis.net.pe/api-consulta-dni.html',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos del DNI' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ API DNI funcionando');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
