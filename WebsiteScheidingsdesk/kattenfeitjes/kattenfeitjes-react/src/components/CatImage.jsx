import { useState, useEffect } from 'react';

export default function CatImage() {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCatImage = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Fetch random cat image from cataas.com
      const timestamp = new Date().getTime(); // Prevent caching
      const response = await fetch(`https://cataas.com/cat?t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cat image');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      console.error('Error loading cat image:', err);
      setError('Kan geen kattenafbeelding laden. Probeer het later opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatImage();
    
    // Cleanup function to revoke object URL when component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Willekeurige kattenafbeelding</h2>
      
      <div className="mb-4 bg-gray-50 rounded-md overflow-hidden">
        {isLoading && (
          <div className="p-4 text-center">
            <p className="text-gray-600">Afbeelding laden...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {imageUrl && !isLoading && !error && (
          <img 
            src={imageUrl} 
            alt="Random cat" 
            className="w-full rounded-md shadow-sm"
          />
        )}
      </div>
      
      <button 
        onClick={loadCatImage}
        disabled={isLoading}
        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors"
      >
        Nieuwe kattenafbeelding
      </button>
    </div>
  );
}