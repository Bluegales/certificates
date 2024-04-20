
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import { router as r1 } from './login';
import { router as r2 } from './certificate';
import cors from 'cors';
import { load } from 'ts-dotenv';
import path from 'path';

export const env = load({
    SESSION_KEY: String,
    PRIVATE_KEY: /^0x[0-9A-Fa-f]+$/,
    LIGHT_HOUSE_API_KEY: String
  }, '../.env');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

app.use(session({
    secret: env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 12 * 60 * 60 * 1000 // 12 hours
    }
}));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Certificate Generator API',
            version: '1.0.0',
            description: 'API for the certificate generator',
        },
        components: {
            securitySchemes: {
                JWT: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/login.ts', './src/certificate.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', r1);
app.use('/api', r2);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
