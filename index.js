const express = require("express");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");
const app = express();
const cors = require("cors");
const moment = require('moment');
//const fs = require('fs');
const { v4 } = require('uuid')

app.use(express.json());
app.use(cors({ origin: "*" }))

app.post("/generate-certificate", (req, res) => {
    let { name, additionalText, email, phone } = req.query;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
	
	try{
      fs.writeFileSync('./certificates/' + v4() + '.json', JSON.stringify({ name, email, phone }));
    } catch(error){}


    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    const outputFilePath = path.join(__dirname, `certificate_${name}.pdf`);
    const stream = fs.createWriteStream(outputFilePath);

    doc.pipe(stream);
    doc.image("certificate.jpeg", 0, 0, { width: 842, height: 595 });

    function formatName(name) {
      return name
          .toLowerCase() // Convert everything to lowercase
          .split(' ') // Split by space
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
          .join(' '); // Join words back together
  }
  
  // Example usage:
      name = formatName(name);

	//    const buffer = fs.readFileSync("./Montserrat-Regular.ttf");
  //  doc.font(buffer).fontSize(20).fillColor("black").text(name, 80, 280, { align: "center" });
// const fontBuffer2 = fs.readFileSync(path.join(__dirname, '..', 'Montserrat-Regular.ttf'));
    //  const a = moment(new Date()).format('DD-MM-YYYY')
  //    doc.font(fontBuffer2).fontSize(15).fillColor('black').text(a, 80, 468, { align: 'center' });


	const fontBuffer = fs.readFileSync(path.join(__dirname, '..', 'GreatVibes-Regular.ttf'));
      doc.font(fontBuffer).fontSize(24).fillColor('black').text(name, 80, 275, { align: 'center' });

      const fontBuffer2 = fs.readFileSync(path.join(__dirname, '..', 'Montserrat-Regular.ttf'));
      const a = moment(new Date()).format('DD-MM-YYYY')
      doc.font(fontBuffer2).fontSize(15).fillColor('black').text(a, 80, 468, { align: 'center' });

      if (additionalText) {
        doc.fontSize(18).fillColor('red').text(additionalText, 80, 295, { align: 'center' });
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
