
import express, { Request, Response, NextFunction } from 'express';
import { sendEmail } from './mail';

export const router = express.Router();

/**
 * @swagger
 * /logged-in:
 *   get:
 *     summary: Check if user is logged in
 *     tags:
 *       - Authentication
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Indicates if user is logged in
 *               example: logged in
 *       401:
 *         description: Unauthorized
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message
 *               example: Unauthorized
 */
router.get('/logged-in', (req: Request, res: Response) => {
    if (req.session.loggedIn === true) {
        res.status(200).json({ message: 'logged in' });
        return 
    } else {
        res.status(401).json({ message: 'Unauthorized' });
        return 
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in user and send verification code to email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *             example:
 *               email: user@example.com
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the verification code has been sent to the user's email.
 *             example:
 *               message: Code sent to email.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the reason for the bad request.
 *             example:
 *               message: Invalid email format.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the reason for the internal server error.
 *             example:
 *               message: Error sending email.
 */
router.post('/login', (req: Request, res: Response) => {
    const { email } = req.body;
    req.session.email = email;
    const code = Math.floor(Math.random() * 1_000_000);
    req.session.code = code;
    console.debug(req.session)
    sendEmail(email, code);
    req.session.save()
    res.status(200).json({ message: 'Code sent to email.' });
});

/**
 * @swagger
 * /verify:
 *   post:
 *     summary: Verify code and initiate session
 *     tags:
 *       - Authentication
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: integer
 *                 description: Verification code submitted by the user
 *             example:
 *               code: 123456
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the session has been initiated successfully.
 *             example:
 *               message: Session initiated successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the reason for the bad request.
 *             example:
 *               message: Invalid verification code
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the reason for the internal server error.
 *             example:
 *               message: Error initiating session
 */
router.post('/verify', async (req: Request, res: Response) => {
    if (!req.session.email || !req.session.code) {
        res.status(400).json({ message: 'no login attempt' });
        return
    }    
    if (req.body.code !== req.session.code) {
        res.status(400).json({ message: 'Invalid verification code' });
        return
    }
    req.session.loggedIn = true;
    delete req.session.code;
    req.session.save();

    res.status(200).json({ message: 'Session initiated successfully' });
    // implement additional login checks here
    // example:

    // interface UserData { id: string }
    // try {
    //     const response = await axios.get<UserData>(`${env.REMOTE_URL}/get-user`, { params: { email: req.session.email } });
    //     req.session.user_id = response.data.id;
    //     req.session.save();
    //     res.status(200).json({ message: 'Session initiated successfully' });
    //     return 
    // }
});

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// export default authenticateUser;
