import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
const data = [
  { skill: 'Communication skills', frequency: 15 },
  { skill: "Bachelor's degree in relevant field", frequency: 14 },
  { skill: 'Microsoft Office proficiency', frequency: 10 },
  { skill: 'Problem-solving skills', frequency: 9 },
  { skill: 'Project management', frequency: 8 },
  { skill: 'Teamwork / collaboration', frequency: 8 },
  { skill: 'AutoCAD experience', frequency: 7 },
  { skill: 'Data analysis', frequency: 6 },
  { skill: 'Programming skills (various languages)', frequency: 6 },
  { skill: 'Time management', frequency: 5 }
];
const GPTComponent: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Most In-Demand Skills and Qualifications</h1>
      <div className="w-full max-w-4xl h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 220,
              bottom: 5,
            }}
          >
            <XAxis type="number" />
            <YAxis dataKey="skill" type="category" width={200} />
            <Tooltip />
            <Bar dataKey="frequency" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default GPTComponent;