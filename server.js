import express from 'express';
import nodeHtmlToImage from 'node-html-to-image';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const loadTemplate = async (name) => {
  const content = await fs.readFile(`./templates/${name}.hbs`, 'utf-8');
  return Handlebars.compile(content);
};

app.get('/reniec-img', async (req, res) => {
  const template = await loadTemplate('reniec');

  const datos = {
    dni: req.query.dni || '12345678',
    nombres: 'Juan',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'López',
    domicilio: 'Av. Perú 123',
    estadoCivil: 'Soltero(a)',
    foto: 'https://i.imgur.com/Qr71crq.png' // Puedes cambiarlo por la URL real de la imagen
  };

  const html = template({
    ...datos,
    nombreCompleto: `${datos.nombres} ${datos.apellidoPaterno} ${datos.apellidoMaterno}`,
  });

  const image = await nodeHtmlToImage({
    html,
    type: 'png',
    quality: 100,
    encoding: 'binary',
    puppeteerArgs: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
  });

  res.setHeader('Content-Type', 'image/png');
  res.send(image);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('✅ API Imagen corriendo');
});
