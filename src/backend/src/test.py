import pandas as pd

df = pd.read_csv("jobs.csv")
data = df[['id','title','job_type','job_level','description']]
print(data.head().to_json())