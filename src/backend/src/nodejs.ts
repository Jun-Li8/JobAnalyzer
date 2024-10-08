import express, { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path'

const app = express();
const port = 3000;
 

app.use(express.json());

app.post('/api/get-data', (req: Request, res: Response) => {
  const {job, numResult, site} = req.body;
  console.log("Running")
  const pythonProcess = spawn('python3', ['test.py', job, numResult, site]);  

  let dataToSend = '';
  
  pythonProcess.stdout.on('data', (data: Buffer) => {
    dataToSend += data.toString();
  });
  
  pythonProcess.stderr.on('data', (data: Buffer) => {
    console.error(`Python script error: ${data}`);
  });
  
  pythonProcess.on('close', (code: number) => {
    console.log(`Python script exited with code ${code}`);
    res.json(JSON.parse(dataToSend));
    console.log(JSON.parse(dataToSend))
  });
});

app.get('/test', (req: Request, res: Response) => {
  res.json({message:'PLEASE WORK'});
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

