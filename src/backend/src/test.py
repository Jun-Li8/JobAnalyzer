import sys
import json


def test(job, numResults, site):
    result = {
        "message" : "successful!",
        "job" : job,
        "numResults" : numResults,
        "site" : site
    }
    print(json.dumps(result))


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({"error": 'Expected 3 parameters'}))
    else:
        test(sys.argv[0],sys.argv[1],sys.argv[2])