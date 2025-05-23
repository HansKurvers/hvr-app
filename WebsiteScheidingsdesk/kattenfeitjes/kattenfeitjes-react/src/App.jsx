import CatFact from './components/CatFact';
import CatImage from './components/CatImage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-white text-center">
            🐱 Kattenfeitjes 🐱
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CatFact />
          <CatImage />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Kattenfeitjes - Alle rechten voorbehouden</p>
        </div>
      </footer>
    </div>
  );
}

export default App;