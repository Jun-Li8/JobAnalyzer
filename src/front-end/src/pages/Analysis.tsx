import React, {useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import {IJob} from '../../../backend/src/model/Jobs';
import GPTComponent from "./GPTComponent"
import GPTQueryBar from '../components/GPTQueryBar';



interface Collection {
    _id: string;
    collection_name: string;
    data?: IJob[]
}

const Analysis = () => {
    const [collectionNames, setCollectionNames] = useState<Collection[]>([]);

    useEffect(() => {
        const fetchAllCollections = async () => {
            try{
                const response = await fetch('/api/get-data-from-db');
                const data = await response.json();
                setCollectionNames(data)
                console.log(collectionNames)
                collectionNames.map((collection) => console.log(collection._id));
            } catch (error){
                console.error('Error fetching collections:', error);
            }
        };
        fetchAllCollections();
    },[]);

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Collection List</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {collectionNames.map(collection => (
                        <Link
                            to={`/analysis/${collection._id}`}
                            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"    
                        >
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{collection.collection_name}</h5>
                        </Link>

                    ))}
                </div>
        </div>
    );
}

const AnalysisDetails = () => {
    const collectionID = useParams<{id: string}>();
    const [jobsData,setJobsData] = useState<Collection | null>(null);
    const [haveClicked, setHaveClicked] = useState<boolean>(false);

    useEffect(() => {
        const fetchSingleCollection = async () => {
            try {
                const response = await fetch(`/api/get-data-from-db/${collectionID.id}`);
                const data = await response.json();
                console.log(data);
                setJobsData(data);
            } catch (error) {
                console.error('Error fetching jobs data:', error);
            }
        };
        fetchSingleCollection();
    },[collectionID]);

    if(!jobsData) return <h3>Loading...</h3>;

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">{jobsData.collection_name}</h1>
            <p className="mb-4"><strong>Number of jobs:</strong> {jobsData.data?.length}</p>
            <GPTQueryBar jobData={jobsData?.data || []} setValue={setHaveClicked}/>
            {haveClicked ? <GPTComponent /> : null}
        </div>
    );
} 


export {Analysis, AnalysisDetails};