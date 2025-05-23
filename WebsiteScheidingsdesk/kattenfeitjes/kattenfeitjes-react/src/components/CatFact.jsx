import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CatFact() {
  const [fact, setFact] = useState('Klik op de knop om een kattenfeitje te laden...');
  const [factCount, setFactCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCatFact = async () => {
    try {
      setIsLoading(true);
      setFact('Laden...');
      
      const response = await axios.get('https://catfact.ninja/fact');
      setFact(response.data.fact);
      setFactCount(prev => prev + 1);
    } catch (error) {
      setFact('Er ging iets mis bij het ophalen van het kattenfeitje.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatFact();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Interessante kattenfeitjes</h2>
      
      <div className="mb-4 p-4 bg-gray-50 rounded-md min-h-24 flex items-center">
        <p className="text-gray-700">{fact}</p>
      </div>
      
      <div className="mb-4 text-sm text-gray-600">
        Aantal feiten geladen: {factCount}
      </div>
      
      <button 
        onClick={fetchCatFact}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        Nieuw kattenfeitje
      </button>
    </div>
  );
}