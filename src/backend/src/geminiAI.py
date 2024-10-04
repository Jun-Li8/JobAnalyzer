import pandas as pd
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

gemini_api_key = os.environ.get('GEMINI_API_KEY')

genai.configure(api_key=gemini_api_key)

model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Write a story about a magic backpack.")
print(response.text)

# df = pd.read_csv("jobs.csv")
#data = df[['id','title','job_type','job_level','description']]
#print(data.head().to_json()) /