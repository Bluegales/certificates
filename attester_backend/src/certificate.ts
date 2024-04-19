
import express, { Request, Response } from 'express';
import { authenticateUser } from './login';
import { Certificate, CertificatesID, certificates } from '../certificate_list';
import { generateDummyPdf } from './pdf_generator/pdf_generator'
import { Readable } from 'stream';
import { createHash } from 'crypto'
import { createAttestation } from './hash_1_attest'
import { getCertificate, insertCertificate } from './db';
import { createTempFile, deleteTempFile, downloadDecrypt, uploadEncrypted } from './file_upload_download';

export const router = express.Router();

/**
 * @swagger
 * /certificate/available:
 *   get:
 *     summary: Retrieve available certificates
 *     description: Retrieve a list of available certificates.
 *     tags:
 *       - Certificate
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: A list of available certificates
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                    name:
 *                      type: string
 *                    description:
 *                      type: string
 */
router.get('/certificate/available', authenticateUser, async (req: Request, res: Response) => {
    // Implement here your own login this is just dummy code to test it

    var available: Certificate[] = []
    available = available.concat(certificates[CertificatesID.Dummy])

    const filteredElements = available.map(({ id, name, description }) => ({ id, name, description }));
    res.status(200).json(filteredElements);
    return
});

/**
 * @swagger
 * /certificate/{id}/create:
 *   post:
 *     summary: Create a certificate
 *     description: Create a certificate.
 *     tags:
 *       - Certificate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the certificate.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success. The certificate was created successfully.
 *       400:
 *         description: Bad Request. The request is malformed or missing required parameters.
 *       500:
 *         description: Internal Server Error. Something went wrong on the server side.
 */
router.post('/certificate/:id/create', async (req: Request, res: Response) => {
    const { id } = req.params;
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
        res.status(400).json({ error: 'Invalid ID' });
        return 
    }
    const cert = await getCertificate(req.session.email ?? "", idNumber)
    if (cert.length != 0) {
        res.status(400).json({ message: 'certificate already created' });
        return;
    }
    const foundCertificate = Object.values(certificates).find(cert => cert.id === idNumber);
    if (!foundCertificate) {
        res.status(404).json({ error: 'Certificate not found' });
        return 
    }
    const fileBuffer: Buffer = await generateDummyPdf(req.session.email ?? "noone")

    // attestation
    const hash = createHash('sha256');
    hash.update(fileBuffer);
    const sha256Hash = hash.digest('hex');
    console.log(sha256Hash)
    createAttestation(`0x${sha256Hash}`);

    // ipfs
    const path = await createTempFile(fileBuffer)
    const cid = await uploadEncrypted(path)
    console.log(cid)
    await deleteTempFile(path)

    // local database
    insertCertificate(req.session.email ?? "test", cid.data[0].Hash, idNumber)

    res.status(200).json({ message: 'ok' });
});

/**
 * @swagger
 * /certificate/{id}/download:
 *   get:
 *     summary: Download a certificate
 *     description: Dowload a certificate which was previously created.
 *     tags:
 *       - Certificate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the certificate.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success. The certificate was downloaded successfully.
 *       400:
 *         description: Bad Request. The request is malformed or missing required parameters.
 *       500:
 *         description: Internal Server Error. Something went wrong on the server side.
 */
router.get('/certificate/:id/download', async (req: Request, res: Response) => {
    const { id } = req.params;
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
        res.status(400).json({ error: 'Invalid ID' });
        return 
    }
    const cert = await getCertificate(req.session.email ?? "test", idNumber)
    if (cert.length == 0) {
        res.status(400).json({ message: 'certificate not created' });
        return;
    }
    const arraybuffer : ArrayBuffer = await downloadDecrypt(cert[0].eid)
    const buffer = Buffer.from(arraybuffer);

    res.setHeader('Content-disposition', 'attachment; filename=certificate.pdf');
    res.setHeader('Content-type', 'application/octet-stream');
    res.send(buffer);
});
