import React, { ChangeEvent, useState ,FormEvent} from "react";

const Home = () => {
    const catList: string[] = ["Indeed","LinkedIn","ZipRecuiter"];

    const [job, setJob] = useState<string>('');
    const [numResult, setNumResult] = useState<number | undefined>(50);
    const [site,setSite] = useState<string>(catList[0]);
    const [loading,setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string>('');

    const runAnalysis = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try{
            const response = await fetch('/api/get-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({job,numResult,site}),
            });
            const data = await response.json();
            setResult(data.message);
        } catch (error){
            console.error('Error Running the Python Script: ', error);
            setResult('Error running script');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={runAnalysis} className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
                <div className="mb-4">
                    <InputField 
                        fieldName="Search" 
                        fieldID="search" 
                        fieldplaceHolder="Enter for a title job to analyze" 
                        fieldType={FieldTypes.Text} 
                        value={job}
                        onChange={(e:ChangeEvent<HTMLInputElement>) => setJob(e.target.value)}/>
                    <InputField 
                        fieldName="Number of Results" 
                        fieldID="num_results" 
                        fieldplaceHolder="Enter the number of posting to analyze" 
                        fieldType={FieldTypes.Number} 
                        value={numResult}
                        onChange={(e:ChangeEvent<HTMLInputElement>) => setNumResult(e.target.value === '' ? undefined : Number(e.target.value))}
                        />
                    <CategoryField 
                        fieldName="Site" 
                        fieldID="site" 
                        categoryList={catList} 
                        value={site} 
                        onChange={(e:ChangeEvent<HTMLSelectElement>) => setSite(e.target.value)}/> 
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {loading ? 'Running...' : 'Analyze'}
                    </button>
                    <div className="mt-4 p-2 bg-gray-100 rounded">
                        <h3 className="font-bold">Result:</h3>
                        <pre className="whitespace-pre-wrap">{result}</pre>
                    </div>
                </div>
            </form>
        </div>
    );
}

interface FieldProps {
    fieldName: string;
    fieldID: string;
    fieldplaceHolder?: string;
    value: string | number | undefined;
}

interface InputFieldProps extends FieldProps{
    fieldType: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

enum FieldTypes{
    Text = "text",
    Number = "number"
}

const InputField: React.FC<InputFieldProps> = ({fieldName, fieldID, fieldplaceHolder, fieldType, value, onChange}) => {
    return (
        <div className="mb-4">
            <label htmlFor={fieldID} className="block text-gray-700 text-sm font-bold mb-2 items-start">
                {fieldName}
            </label>
            <input 
                type={fieldType}
                id={fieldID}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={fieldplaceHolder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

interface CategoryFieldProps extends FieldProps {
    categoryList: string[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const CategoryField: React.FC<CategoryFieldProps> = ({fieldName, fieldID, categoryList, value, onChange}) => {
    return (
        <div className="mb-4">
            <label htmlFor={fieldID} className="block text-gray-700 text-sm font-bold mb-2 items-start">
                {fieldName}
            </label>
            <select 
                id={fieldID}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={onChange}
            >
                {categoryList.map((cat) => (
                    <option value={cat}>{cat}</option>
                ))}
            </select>
        </div>
    );
}



export default Home;