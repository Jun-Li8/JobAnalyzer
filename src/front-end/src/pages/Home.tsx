import React from "react";

const Home = () => {
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
                <div className="mb-4">
                    <Field fieldName="Site" fieldID="site" fieldType="text"/>
                    <Field fieldName="Job Title" fieldID="jobTitle" fieldType="text"/>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

interface FieldProps {
    fieldName: string,
    fieldID: string,
    fieldType: string
}

const Field: React.FC<FieldProps> = ({fieldName, fieldID, fieldType}) => {
    return (
        <div className="mb-4">
            <label htmlFor={fieldID} className="block text-gray-700 text-sm font-bold mb-2 items-start">
                {fieldName}
            </label>
            <input 
                type={fieldType}
                id={fieldID}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}

export default Home;