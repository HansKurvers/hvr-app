import axios from 'axios';
import { loadCatImage } from './catImage';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  // Create main container with left and right columns
  const container = document.createElement('div');
  container.className = 'container';
  
  const leftColumn = document.createElement('div');
  leftColumn.className = 'column';
  
  const rightColumn = document.createElement('div');
  rightColumn.className = 'column';
  
  // Create UI elements for left column (cat facts)
  const factsHeader = document.createElement('h2');
  factsHeader.textContent = 'Interessante kattenfeitjes';
  
  const factDisplay = document.createElement('div');
  factDisplay.className = 'fact-display';
  factDisplay.textContent = 'Klik op de knop om een kattenfeitje te laden...';
  
  const factCounter = document.createElement('div');
  factCounter.className = 'fact-counter';
  factCounter.textContent = 'Aantal feiten geladen: 0';
  
  const factButton = document.createElement('button');
  factButton.textContent = 'Nieuw kattenfeitje';
  factButton.addEventListener('click', fetchCatFact);
  
  // Create UI elements for right column (cat images)
  const imagesHeader = document.createElement('h2');
  imagesHeader.textContent = 'Willekeurige kattenafbeelding';
  
  const imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';
  
  const imageButton = document.createElement('button');
  imageButton.textContent = 'Nieuwe kattenafbeelding';
  imageButton.addEventListener('click', () => loadCatImage(imageContainer));
  
  // Add elements to DOM
  leftColumn.appendChild(factsHeader);
  leftColumn.appendChild(factDisplay);
  leftColumn.appendChild(factCounter);
  leftColumn.appendChild(factButton);
  
  rightColumn.appendChild(imagesHeader);
  rightColumn.appendChild(imageContainer);
  rightColumn.appendChild(imageButton);
  
  container.appendChild(leftColumn);
  container.appendChild(rightColumn);
  app.appendChild(container);
  
  // Initialize counters
  let factCount = 0;
  
  // Function to fetch cat facts
  async function fetchCatFact() {
    try {
      factButton.disabled = true;
      factDisplay.textContent = 'Laden...';
      
      const response = await axios.get('https://catfact.ninja/fact');
      factDisplay.textContent = response.data.fact;
      
      // Update counter
      factCount++;
      factCounter.textContent = `Aantal feiten geladen: ${factCount}`;
    } catch (error) {
      factDisplay.textContent = 'Er ging iets mis bij het ophalen van het kattenfeitje.';
      console.error(error);
    } finally {
      factButton.disabled = false;
    }
  }
  
  // Get initial cat fact and image
  fetchCatFact();
  loadCatImage(imageContainer);
});