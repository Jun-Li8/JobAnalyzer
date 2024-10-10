import mongoose, {model, Schema} from "mongoose";

interface IJob extends Document{
    title : string;
    company: string;
    job_location: string;
    description: string;
}

const JobSchema: Schema = new Schema({
    title: {type: String, required: true},
    company: {type: String, required: true},
    job_location: {type: String, required: true},
    description: {type: String, required: true}
});

interface IJobs extends Document{
    collection_name: string;
    data: IJob[];
}
const JobsSchema: Schema = new Schema({
    collection_name: {type: String, required: true},
    data: [JobSchema]
});

const Jobs = mongoose.model<IJobs>('Jobs',JobsSchema,'Jobs');

export {IJobs,Jobs,IJob};

