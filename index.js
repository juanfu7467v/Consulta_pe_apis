app.get("/reniec-img", async (req, res) => {
  const dni = req.query.dni;
  if (!dni) {
    return res.status(400).json({ error: "Falta el DNI" });
  }

  const url = `https://poxy-production.up.railway.app/reniec?dni=${dni}&source=database`;

  try {
    const response = await fetch(url);
    const imageBuffer = await response.arrayBuffer();
    res.set("Content-Type", "image/jpeg");
    res.send(Buffer.from(imageBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener la imagen" });
  }
});
