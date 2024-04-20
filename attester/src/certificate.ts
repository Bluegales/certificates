
import express, { Request, Response } from 'express';
import { Certificate, CertificatesID, certificates } from '../certificate_list';
import { generateDummyPdf } from './pdf_generator/pdf_generator'
import { getCertificate, insertCertificate } from './db';
import * as lighthouse from './lighthouse'
import * as ethsign from './ethsign'

export const router = express.Router();

/**
 * @swagger
 * /api/certificate/available:
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
 *                    created:
 *                      type: boolean
 */

interface CertificateWithCreated extends Certificate {
    created: boolean;
}

router.get('/certificate/available', async (req: Request, res: Response) => {
    // Implement here your own login this is just dummy code to test it

    var available: Certificate[] = []
    available = available.concat(certificates[CertificatesID.Dummy])
    // add more certificates here
    
    const available_with_created = available.map(certificate => ({ ...certificate, created: false }));
    const created_certificates = await getCertificate(req.session.email ?? "test");
    available_with_created.forEach((certificate) => {
        certificate.created = created_certificates.some((createdCertificate) => {
            return createdCertificate.certificate_id === certificate.id;
        });
    });

    res.status(200).json(available_with_created);
    return
});

/**
 * @swagger
 * /api/certificate/{id}/create:
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
 *       403:
 *         description: Forbidden Request. Either you aren't logged in or the certificate got created already.
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
    if (idNumber != 0) {
        res.status(403).json({ error: 'forbidden' });
        return 
    }
    const cert = await getCertificate(req.session.email ?? "test", idNumber)
    if (cert.length != 0) {
        res.status(403).json({ message: 'certificate already created' });
        return;
    }
    const foundCertificate = Object.values(certificates).find(cert => cert.id === idNumber);
    if (!foundCertificate) {
        res.status(404).json({ error: 'Certificate not found' });
        return 
    }

    try {
        // pdf generation
        const fileBuffer: Buffer = await generateDummyPdf(req.session.email ?? "test")
        // attestation
        ethsign.attestBuffer(fileBuffer)
        // lighthouse
        const upload_response = await lighthouse.Upload(fileBuffer)
        // local database
        insertCertificate(req.session.email ?? "test", upload_response[0].Hash, idNumber)
        res.status(200).json({ message: 'ok' });
    } catch (err) {
        console.log(err)
        res.status(500);
    }
});

/**
 * @swagger
 * /api/certificate/{id}/download:
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
    console.log(idNumber)
    if (cert.length == 0) {
        res.status(400).json({ message: 'certificate not created' });
        return;
    }
    try {
        const arraybuffer = await lighthouse.Download(cert[0].cid)
        const buffer = Buffer.from(arraybuffer);
    
        res.setHeader('Content-disposition', 'attachment; filename=certificate.pdf');
        res.setHeader('Content-type', 'application/octet-stream');
        res.send(buffer);
    } catch (err) {
        console.log(err)
        res.status(500);
    }
});

/**
 * @swagger
 * /api/certificate/{id}/share:
 *   post:
 *     summary: Share a certificate with a wallet address
 *     description: Gives the holder of a wallet permission to download the certificate
 *     tags:
 *       - Certificate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the certificate.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: wallet_address
 *         required: true
 *         description: The wallet address in hex format.
 *         schema:
 *           type: string
 *           format: hex
 *       - in: query
 *         name: name
 *         required: true
 *         description: The name of the file (PUBLIC!!).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success. The certificate was downloaded successfully.
 *       400:
 *         description: Bad Request. The request is malformed or missing required parameters.
 *       500:
 *         description: Internal Server Error. Something went wrong on the server side.
 */
router.post('/certificate/:id/share', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const walletAddress = req.query.wallet_address;
        const name = req.query.name;
        const idNumber = parseInt(id);
        if (isNaN(idNumber)) {
            res.status(400).json({ error: 'Invalid ID' });
            return 
        }
        if (typeof walletAddress !== 'string') {
            res.status(400).json({ error: 'Wallet address must be a string' });
            return 
        }
        if (typeof name !== 'string') {
            res.status(400).json({ error: 'Name must be a string' });
            return 
        }
        const cert = await getCertificate(req.session.email ?? "test", idNumber)
        if (cert.length == 0) {
            res.status(400).json({ message: 'certificate not created' });
            return;
        }
        const share_response = await lighthouse.Share(cert[0].cid, walletAddress)
        await ethsign.createCidAttestation(name, cert[0].cid)
        res.status(200).json(share_response)
    } catch (err) {
        console.log(err)
    }
});
