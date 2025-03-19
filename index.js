const express = require("express");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");
const app = express();
const cors = require("cors");
const moment = require("moment");
//const fs = require('fs');
const { v4 } = require("uuid");

app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/generate-certificate", (req, res) => {
  let { name, additionalText, email, city, phone } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    fs.writeFileSync(
      "./certificates/" + v4() + ".json",
      JSON.stringify({ name, email, phone, city })
    );
  } catch (error) {}

  const doc = new PDFDocument({ size: "A4", layout: "landscape" });
  const outputFilePath = path.join(__dirname, `certificate_${name}.pdf`);
  const stream = fs.createWriteStream(outputFilePath);

  doc.pipe(stream);
  doc.image("certificate.jpeg", 0, 0, { width: 842, height: 595 });

  function formatName(name) {
    return name
      .toLowerCase() // Convert everything to lowercase
      .split(" ") // Split by space
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(" "); // Join words back together
  }

  name = formatName(name);

  const fontBuffer = fs.readFileSync(
    path.join(__dirname, "..", "Boldonse-Regular.ttf")
  );
  doc
    .font(fontBuffer)
    .fontSize(25)
    .fillColor("black")
    .text(name, 80, 264, { align: "center" });

  const fontBuffer2 = fs.readFileSync(
    path.join(__dirname, "..", "Montserrat-Regular.ttf")
  );
  const a = moment(new Date()).format("DD-MM-YYYY");
  doc
    .font(fontBuffer2)
    .fontSize(15)
    .fillColor("black")
    .text(a, 80, 468, { align: "center" });

  if (additionalText) {
    doc
      .fontSize(18)
      .fillColor("red")
      .text(additionalText, 80, 295, { align: "center" });
  }
  doc.end();

  stream.on("finish", () => {
    res.download(outputFilePath, `certificate_${name}.pdf`, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).send("Error downloading file");
      }
      fs.unlinkSync(outputFilePath); // Delete file after download
    });
  });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
