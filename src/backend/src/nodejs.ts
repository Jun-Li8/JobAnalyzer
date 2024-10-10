import express, { Request, Response } from 'express';
import { spawn } from 'child_process';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json())


app.post('/api/get-data', (req: Request, res: Response) => {
  const {job, numResult, site, collectionName} = req.body;
  const pythonProcess = spawn('python3', ['scraper.py', job, numResult, site, collectionName]);  

  let dataToSend = '';
  
  pythonProcess.stdout.on('data', (data: Buffer) => {
    dataToSend += data.toString();
  });
  
  pythonProcess.stderr.on('data', (data: Buffer) => {
    console.error(`Python script error: ${data}`);
  });
  
  pythonProcess.on('close', (code: number) => {
    console.log(`Python script exited with code ${code}`);
    res.send(dataToSend);
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

