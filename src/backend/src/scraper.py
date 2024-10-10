import csv
from jobspy import scrape_jobs
import sys
import json
from dotenv import load_dotenv
import os
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')

client = MongoClient(MONGODB_URI)

db = client['JobsDB']
collection = db['Jobs']

def scape(job,numResults,site,collectionName):
    df = scrape_jobs(
        site_name=[site],
        search_term=job,
        results_wanted=numResults,
        hours_old=72, # (only Linkedin/Indeed is hour specific, others round up to days old)
        country_indeed='USA',  # only needed for indeed / glassdoor
        
        # linkedin_fetch_description=True # get more info such as full description, direct job url for linkedin (slower)
        # proxies=["208.195.175.46:65095", "208.195.175.45:65095", "localhost"],
    )
    
    data = df[["title","company","location","description"]]
    data_dict = {'collection_name': collectionName, 'data': data.to_dict("records")}

    collection.insert_one(data_dict)

    print(f"Found {len(data)} jobs")
    data.to_csv("jobs.csv", quoting=csv.QUOTE_NONNUMERIC, escapechar="\\", index=False) # to_excel



if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(json.dumps({"error": 'Expected 4 parameters'}))
    else:
        scape(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4])