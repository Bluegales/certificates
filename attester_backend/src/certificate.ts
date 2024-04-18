
import express, { Request, Response } from 'express';
import { authenticateUser } from './login';
import { Certificate, CertificatesID, certificates } from '../certificate_list';
import { generateDummyPdf } from './pdf_generator/pdf_generator'
import { Readable } from 'stream';
import { createHash } from 'crypto'
import { createAttestation } from './hash_1_attest'

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
 *   get:
 *     summary: Create a certificate
 *     description: Create a certificate for the entity with the specified ID.
 *     tags:
 *       - Certificate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the entity for which the certificate is being created.
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
router.get('/certificate/:id/create', async (req: Request, res: Response) => {
    const { id } = req.params;
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    const foundCertificate = Object.values(certificates).find(cert => cert.id === idNumber);
    if (!foundCertificate) {
        return res.status(404).json({ error: 'Certificate not found' });
    }
    const fileBuffer: Buffer = await generateDummyPdf(req.session.email ?? "noone")

    const hash = createHash('sha256');
    hash.update(fileBuffer);
    const sha256Hash = hash.digest('hex');
    console.log("SHA-256 Hash:", sha256Hash);
    createAttestation(`0x${sha256Hash}`);
    
    const fileStream = new Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null);

    res.setHeader('Content-disposition', 'attachment; filename=certificate.pdf');
    res.setHeader('Content-type', 'application/octet-stream');
    fileStream.pipe(res);

});

router.post('/certificate/:id/download', authenticateUser, (req: Request, res: Response) => {
    res.json({ message: 'You are authorized to access this endpoint.' });
});
