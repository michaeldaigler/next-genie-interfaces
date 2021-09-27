import express from 'express';
import cors from 'cors';
import osSdk from 'opensea-js';
import erc721Router from './routes/erc-721-routes';

const app = express();

const PORT = 8000;

app.use(express.json());
app.use(cors())





app.listen(PORT, "localhost", () => {
    console.log(`Listening on port ${8000}`);
})