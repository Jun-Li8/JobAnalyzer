import React, { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import {IJob} from '../../../backend/src/model/Jobs';

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

interface QueryBarProps {
  jobData: IJob[];
  setValue: SetStateFunction<boolean>;
}

const GPTQueryBar: React.FC<QueryBarProps> = ({jobData, setValue}) => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/gpt-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query,jobData }),
      });
      const data = await res.json();
      setResponse(data.message);
      setValue(true);
    } catch (error) {
      console.error('Error querying GPT:', error);
      setResponse('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <form onSubmit={handleSubmit} className="flex items-center mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Enter your query here..."
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin">&#8987;</span>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Response:</h2>
          <p className="text-gray-600">{response}</p>
        </div>
      )}
    </div>
  );
};

export default GPTQueryBar;