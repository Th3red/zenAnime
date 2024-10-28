// App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [character, setCharacter] = useState(null);
    const [quote, setQuote] = useState('');

    // Fetch random anime character
    const fetchAnimeCharacter = async () => {
        try {
            const response = await axios.get('https://api.jikan.moe/v4/random/characters');
            setCharacter(response.data.data); // Set the entire character data for later use
        } catch (error) {
            console.error("Error fetching character:", error);
        }
    };

    // Fetch a random zen quote
// App.jsx
    const fetchZenQuote = async () => {
      try {
          const response = await fetch('http://localhost:3000/quote');
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setQuote(data[0].q); // Adjust according to the response structure
      } catch (error) {
          console.error("Error fetching quote:", error);
          setQuote("Failed to fetch quote.");
      }
    };


    useEffect(() => {
        fetchAnimeCharacter();
        fetchZenQuote(); // Fetch a random quote on component mount
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Random Anime Inspiration</h1>
            {character ? (
                <>
                    <img 
                        src={character.images.jpg.image_url} // Accessing the correct image URL
                        alt={character.name} 
                        style={{ maxWidth: '600px', height: 'auto' }} // Adjust size as needed
                    />
                    <h3>{character.name}</h3> {/* Display character name */}
                   <h4>{quote || "Loading quote..."}</h4> {/* Display the quote */}
                    <p>
                        Inspirational quotes provided by <a href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes API</a>
                    </p>
                </>
            ) : (
                <p>Loading character image...</p>
            )}
            
            <button onClick={() => { fetchAnimeCharacter(); fetchZenQuote(); }}>Get Another</button>
        </div>
    );
}

export default App;

// upper one is for jikan.api
