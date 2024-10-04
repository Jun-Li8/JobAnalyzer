import express, { Request, Response } from 'express';
import { spawn } from 'child_process';

const app = express();
const port = 3000;

app.get('/run-python', (req: Request, res: Response) => {
    const pythonProcess = spawn('python3', ['test.py']);
    
    let dataToSend = '';
    
    pythonProcess.stdout.on('data', (data: Buffer) => {
      dataToSend += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data: Buffer) => {
      console.error(`Python script error: ${data}`);
    });
    
    pythonProcess.on('close', (code: number) => {
      console.log(`Python script exited with code ${code}`);
      res.json(JSON.parse(dataToSend)['id']);
    });
  });
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });