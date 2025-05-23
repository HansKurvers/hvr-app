// Function to fetch and display random cat images
export async function loadCatImage(container) {
  try {
    // Clear previous image
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Show loading state
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Afbeelding laden...';
    container.appendChild(loadingMessage);
    
    // Fetch random cat image from cataas.com
    const timestamp = new Date().getTime(); // Prevent caching
    const response = await fetch(`https://cataas.com/cat?t=${timestamp}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cat image');
    }
    
    // Create image element
    const img = document.createElement('img');
    img.src = URL.createObjectURL(await response.blob());
    img.alt = 'Random cat';
    img.style.width = '100%';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    
    // Remove loading message and add image
    container.removeChild(loadingMessage);
    container.appendChild(img);
    
    return true;
  } catch (error) {
    console.error('Error loading cat image:', error);
    
    // Show error message
    container.innerHTML = '<p>Kan geen kattenafbeelding laden. Probeer het later opnieuw.</p>';
    return false;
  }
}