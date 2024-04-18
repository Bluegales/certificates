import fs from 'fs';
import PDFDocument from 'pdfkit';
// import promptSync from 'prompt-sync';
import { imageSize } from 'image-size';

// const prompt = promptSync();

const loadTemplate = (path: string) => {
  const data = fs.readFileSync(path);
  return JSON.parse(data.toString());
};

const addFooter = (doc: any, template: any, pageWidth: any) => {
  const footerY = doc.page.height - 60;
  doc.fontSize(12).text(`Validate at: ${template.validatelink}`, 0, footerY, {
    width: pageWidth,
    align: 'center'
  });
};

// export const generatePDF = (template: any, recipient: string) => {
//   const doc = new PDFDocument({
//     margin: 50
//   });
//   const now = new Date();
//   const timestamp = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
//   // const outputPath = `./output/${recipient.replace(/[@.]/g, '_')}_${timestamp}.pdf`;
//   // const output = fs.createWriteStream(outputPath);
//   // doc.pipe(output);

//   const dimensions = imageSize(template.logo);
//   if (!dimensions || !dimensions.width) {
//     console.error("Logo dimensions could not be determined.");
//     return;
//   }

//   const pageWidth = doc.page.width;
//   const logoX = (pageWidth / 2) - (dimensions.width / 2);
//   doc.image(template.logo, logoX, 50, { width: 100 });
//   doc.fontSize(25).text(template.issuer, 50, 150);
//   doc.fontSize(18).text(template.certificate_name, 50, 180);
//   doc.fontSize(15).text(`This is to certify that ${recipient}`, 50, 230);
//   doc.fontSize(15).text(template.content, 50, 260, { width: pageWidth - 100, align: 'justify' });

//   addFooter(doc, template, pageWidth);  

//   doc.on('pageAdded', () => {
//     addFooter(doc, template, pageWidth);  
//   });

//   doc.end();
//   console.log('PDF generated successfully. Check:', outputPath);
// };


export const generatePDF = async (template: any, recipient: string) => {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50
    });
    const now = new Date();
    const timestamp = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;

    const dimensions = imageSize(template.logo);
    if (!dimensions || !dimensions.width) {
      reject(new Error("Logo dimensions could not be determined."));
      return;
    }

    const pageWidth = doc.page.width;
    const logoX = (pageWidth / 2) - (dimensions.width / 2);
    doc.image(template.logo, logoX, 50, { width: 100 });
    doc.fontSize(25).text(template.issuer, 50, 150);
    doc.fontSize(18).text(template.certificate_name, 50, 180);
    doc.fontSize(15).text(`This is to certify that ${recipient}`, 50, 230);
    doc.fontSize(15).text(template.content, 50, 260, { width: pageWidth - 100, align: 'justify' });

    addFooter(doc, template, pageWidth);  

    doc.on('pageAdded', () => {
      addFooter(doc, template, pageWidth);  
    });

    const buffers: Uint8Array[] = [];
    doc.on('data', (buffer: Uint8Array) => {
      buffers.push(buffer);
    });

    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.end();
  });
};

export async function generateDummyPdf(recipient: string) {
  return await generatePDF({
    "logo": "src/pdf_generator/images/logo.png",
    "issuer": "University of Blockchain",
    "certificate_name": "Cert of Completion",
    "name_of_recipient": "",
    "content": "Less Text Test.",
    "validatelink": "https://validate.me/here"
}, recipient)
}

// const run = () => {
//   const templates = fs.readdirSync('./templates').filter(file => file.endsWith('.json'));
//   console.log('Available templates:');
//   templates.forEach((template, index) => {
//     console.log(`${index + 1}: ${template}`);
//   });

//   const templateIndex = parseInt(prompt('Enter the number of the template you want to use: ')) - 1;
//   if (templateIndex < 0 || templateIndex >= templates.length) {
//     console.error('Invalid template number.');
//     return;
//   }

//   const template = loadTemplate(`./templates/${templates[templateIndex]}`);
//   const recipient = prompt('Enter the name or email of the recipient: ');

//   generatePDF(template, recipient);
// };

// run();
