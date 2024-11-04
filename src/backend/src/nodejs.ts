import express, { json, Request, Response } from 'express';
import { spawn } from 'child_process';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {IJobs, Jobs} from './model/Jobs'
import fs from 'node:fs';


dotenv.config();

const app = express();
const port = 3000;

app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI2 as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));


const extractAndCleanJSXFromString = (text: string): string[] => {
  // Remove bash code blocks first
  text = text.replace(/```(?:bash|sh)[\s\S]*?```/g, '');

  const jsxRegex = /```(?:jsx|tsx|javascript|typescript|js|ts)?\s*([\s\S]*?)```/g;
  
  let matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = jsxRegex.exec(text)) !== null) {
    let code = match[1].trim();
    code = cleanCode(code);
    if (code) {
      matches.push(code);
    }
  }

  if (matches.length === 0) {
    const scriptRegex = /<script[^>]*(?:type=["'](?:text\/jsx|text\/tsx|application\/javascript|application\/typescript)["'])?[^>]*>([\s\S]*?)<\/script>/g;
    while ((match = scriptRegex.exec(text)) !== null) {
      let code = match[1].trim();
      code = cleanCode(code);
      if (code) {
        matches.push(code);
      }
    }
  }

  if (matches.length === 0) {
    let code = cleanCode(text.trim());
    if (code) {
      matches.push(code);
    }
  }

  return matches;
};

const cleanCode = (code: string): string => {
  // Remove any bash commands (lines starting with $)
  code = code.replace(/^\$.*$/gm, '');

  // Remove any lines that start with 'import type' or 'import interface'
  code = code.replace(/^import\s+(?:type|interface).*$/gm, '');
  
  // Remove TypeScript type annotations
  code = code.replace(/:\s*([A-Z][A-Za-z]*|\{[^}]*\}|\([^)]*\))\s*(?=(,|=|[)\]]}|$))/g, '');
  
  // Remove 'as' type assertions
  code = code.replace(/\s+as\s+[A-Z][A-Za-z]*/g, '');
  
  // Remove standalone 'type' and 'interface' declarations
  code = code.replace(/^(?:export\s+)?(?:type|interface)\s+[^{]+{[^}]*}/gm, '');

  // Remove generic type parameters
  code = code.replace(/<[A-Z][A-Za-z]*(?:,\s*[A-Z][A-Za-z]*)*>/g, '');

  // Remove any lines that are now empty
  code = code.replace(/^\s*[\r\n]/gm, '');

  // Remove any remaining TypeScript-specific syntax (this is a catch-all and might need refinement)
  code = code.replace(/:\s*[A-Z][A-Za-z]*(\[\])?/g, '');

  // Replace "Component.FC" with "Component: React.FC"
  code = code.replace(/(\w+)\.FC/g, '$1: React.FC');

  // Ensure React is imported if it's used
  if (code.includes('React.FC') && !code.includes('import React')) {
    code = "import React from 'react';\n" + code;
  }
  return code.trim();
}; 
  
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


app.get('/api/get-data-from-db', async (req: Request, res: Response) => {
  try {
    const jobs = await Jobs.find({},'collection_name').exec();
    res.json(jobs);
  } catch (error){
    res.status(500).json({message : (error as Error).message});
  }
});


app.get('/api/get-data-from-db/:collectionID', async (req: Request, res: Response) => {
  try {
    const jobs = await Jobs.findById(req.params.collectionID);
    fs.writeFileSync('data.json', JSON.stringify(jobs?.data));
    res.json(jobs);
  } catch (error){
    res.status(500).json({message : (error as Error).message});
  }
});

app.post('/api/gpt-query', async (req: Request, res: Response) => {
  const {query,jobData} = req.body;
  try {
    const pythonProcess = spawn('python3', ['openChartMaker.py',query,JSON.stringify(jobData)]);  

    let dataToSend = '';
    
    pythonProcess.stdout.on('data', (data: Buffer) => {
      dataToSend += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data: Buffer) => {
      console.error(`Python script error: ${data}`);
    });
    
    pythonProcess.on('close', (code: number) => {
      console.log(`Python script exited with code ${code}`);
        // Example usage
      const extractedJSX = extractAndCleanJSXFromString(dataToSend);
      // Write the content to a file
      fs.writeFile('../../front-end/src/pages/GPTComponent.tsx', extractedJSX.join('\n'), (err) => {
          if (err) {
            console.error(err);
          }
          console.log('File written successfully!');
      });
      res.json(extractedJSX);
    });
  } catch (error){
    res.status(500).json({message : (error as Error).message});
  }
});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

