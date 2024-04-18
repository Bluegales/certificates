
import express, { Request, Response } from 'express';
import { authenticateUser } from './login';
import axios from 'axios';
import {Certificates, certificates} from '../certificates';

export const router = express.Router();

interface CertificateList {
    id: number,
    name: string;
    description: string;
}

/**
 * @swagger
 * /certificate/available:
 *   get:
 *     summary: Shows avaliable certificates
 *     tags:
 *       - Certificate
 *     description: |
 *       Retrieves the email from the session and makes a request to another server with that email to see redeemable certificates.
 *     responses:
 *       '200':
 *         description: Email processed successfully
 *       '400':
 *         description: Email not found in session
 *       '500':
 *         description: Internal Server Error
 */
router.get('/certificate/available', authenticateUser, async (req: Request, res: Response) => {
    // const list: Certificates = {}
    // if (typeof req.session.user_id === 'undefined') {
    //     list += certificates['dummy']
    //     list.concat(
    //         { name: "Dummy certificate", description: "We can't find you in our database but this certificate will attest you, that you visited our website :)"}
    //     )
    // } else {
        
    // }
    return res.status(200);
    // res.status(500).send('Not implemented');
    // const email = req.session.email
    // interface UserData {
    //     id: number;
    // }
    // try {
    //     const response = await axios.get<UserData>(`${env.REMOTE_URL}/get-user`, { params: { email: email } });
    //     console.log(response.data.id);
    // } catch (error) {
    //     console.error('Error processing email:', error);
    //     res.status(500).send('Internal Server Error');
    // }
});

router.get('/protected', authenticateUser, (req: Request, res: Response) => {
    res.json({ message: 'You are authorized to access this endpoint.' });
});
