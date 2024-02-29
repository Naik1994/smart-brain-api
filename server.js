import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from 'knex';
import { handleRegister } from './controllers/register.js';
import { signin } from "./controllers/signin.js";
import { profile } from "./controllers/profile.js";
import { faceRecognition, image } from "./controllers/image.js";
import 'dotenv/config';
import fs from 'fs';
import https from 'https';

const key = fs.readFileSync('certs/private.key');
const cert = fs.readFileSync('certs/certificate.crt');

const cred = {
  key, cert
};

const db = knex({
  client: 'pg',
  connection: {
    host : process.env.dbHost,
    port: process.env.dbPort,
    user : process.env.dbUser,
    password: process.env.dbPassword,
    database : process.env.dbName,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

const expressApp = express();
expressApp.use(express.json());
expressApp.use(cors());

expressApp.get("/", (req, res) => {
  db.select('*').from('users')
  .then(users => res.json(users))
  .catch(() => res.status(400).json("Error getting users"))
});

expressApp.post("/signin", (req, res) => signin(req, res, db, bcrypt));

expressApp.post("/register", (req, res) => handleRegister(req, res, db, bcrypt));

expressApp.get("/profile/:id", (req, res) => profile(req, res, db));

expressApp.put("/image", (req, res) => image(req, res, db));

expressApp.post("/recognizeFace", (req, res) => faceRecognition(req, res));

// expressApp.get('/.well-known/pki-validation/679D9854A7464FF51E0B006923050236.txt', (req, res) => res.sendFile('679D9854A7464FF51E0B006923050236.txt'))

expressApp.listen(3001, () => console.log(`Server listening on port ${3001}`));

const server = https.createServer(cred, expressApp);
server.listen(8443);