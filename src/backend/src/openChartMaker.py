from openai import OpenAI
import os
from dotenv import load_dotenv
import sys
import json
import re
import anthropic
import ast
import pandas as pd

def extract_array(string):
    # Find the start and end of the array in the string
    start = string.find('[')
    end = string.rfind(']') + 1
    
    if start == -1 or end == 0:
        raise ValueError("No array found in the string")
    
    # Extract the array substring
    array_string = string[start:end]
    
    # Use ast.literal_eval to safely evaluate the string as a Python expression
    try:
        array = ast.literal_eval(array_string)
        if not isinstance(array, list):
            raise ValueError("Extracted value is not a list")
        return array
    except (ValueError, SyntaxError) as e:
        raise ValueError(f"Failed to parse array: {e}")

load_dotenv() 

def extract_and_clean_jsx_from_string(text):
    # Remove bash code blocks first
    text = re.sub(r'```(?:bash|sh)[\s\S]*?```', '', text)

    # Match JSX/TSX code blocks
    jsx_regex = r'```(?:jsx|tsx|javascript|typescript|js|ts)?\s*([\s\S]*?)```'
    
    matches = []
    for match in re.finditer(jsx_regex, text):
        code = match.group(1).strip()
        code = clean_code(code)
        if code:
            matches.append(code)

    # If no matches found, try to extract everything between script tags
    if not matches:
        script_regex = r'<script[^>]*(?:type=["\'](text/jsx|text/tsx|application/javascript|application/typescript)["\'])?[^>]*>([\s\S]*?)</script>'
        for match in re.finditer(script_regex, text):
            code = match.group(2).strip()
            code = clean_code(code)
            if code:
                matches.append(code)

    # If still no matches, assume the entire text might be JSX/TSX, but clean it
    if not matches:
        code = clean_code(text.strip())
        if code:
            matches.append(code)

    return matches

def clean_code(code):
    # Remove any bash commands (lines starting with $)
    code = re.sub(r'^\$.*$', '', code, flags=re.MULTILINE)

    # Remove any lines that start with 'import type' or 'import interface'
    code = re.sub(r'^import\s+(?:type|interface).*$', '', code, flags=re.MULTILINE)
    
    # Remove TypeScript type annotations
    code = re.sub(r':\s*([A-Z][A-Za-z]*|\{[^}]*\}|\([^)]*\))\s*(?=(,|=|[)\]]}|$))', '', code)
    
    # Remove 'as' type assertions
    code = re.sub(r'\s+as\s+[A-Z][A-Za-z]*', '', code)
    
    # Remove standalone 'type' and 'interface' declarations
    code = re.sub(r'^(?:export\s+)?(?:type|interface)\s+[^{]+{[^}]*}', '', code, flags=re.MULTILINE)

    # Remove generic type parameters
    code = re.sub(r'<[A-Z][A-Za-z]*(?:,\s*[A-Z][A-Za-z]*)*>', '', code)

    # Remove any lines that are now empty
    code = re.sub(r'^\s*$', '', code, flags=re.MULTILINE)

    # Remove any remaining TypeScript-specific syntax (this is a catch-all and might need refinement)
    code = re.sub(r':\s*[A-Z][A-Za-z]*(\[\])?', '', code)

    # Replace "Component.FC" with "Component: React.FC"
    code = re.sub(r'(\w+)\.FC', r'\1: React.FC', code)

    # Ensure React is imported if it's used
    if 'React.FC' in code and 'import React' not in code:
        code = "import React from 'react'\n" + code

    return code.strip()


claude = anthropic.Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))


def main(query,jobData):
    data = json.load(jobData)
    jsonData = claude.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=1000,
        temperature=0.7,
        system="You are a data scientist with access the following json dataset {0}".format(data),
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Parse the given json dataset and output an array of json data that best answers this question: '{0}'".format(query)
                    }
                ]
            }
        ]
    )
    response = claude.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=1000,
        temperature=0.7,
        system="Generate TSX code that creates React component using recharts and TailWind to output a chart that best represents following given array of json data {0}".format(extract_array(jsonData.content[0].text)),
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Create a TypeScript React component using recharts and TailWind that I can run as an TSX file that has a default export called GPTComponent using that best answer following given json data {0}".format(jsonData),
                    }
                ]
            }
        ]
    )
    code = extract_and_clean_jsx_from_string(response.content[0].text)
    message = claude.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=1000,
        temperature=0.7,
        system="You are a proficient React/Typescript/TailWind developer. Make sure to fix the .tsx code that I give you so that it runs without error. In the code, you should use my acutal json data {0}".format(data),
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Fix my code so that it can run without errors: '{0}'".format(code)
                    }
                ]
            }
        ]
    )
    print(extract_and_clean_jsx_from_string(message.content[0].text)[0])
    


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": 'Expected 2 parameters'}))
    else:
        main(sys.argv[1],sys.argv[2])