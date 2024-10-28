import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [character, setCharacter] = useState(null);
    const [quote, setQuote] = useState('');
    const [quoteSource, setQuoteSource] = useState(''); // track api source for logging
    const categories = ['waifu', 'neko', 'shinobu', 'megumin','waifu','megumin', 'waifu', 'cuddle', 'cry', 'waifu', 'hug', 'waifu', 'kiss', 'pat', 'waifu', 'waifu', 'smug','waifu','waifu', 'bonk', 'yeet', 'blush', 'smile', 'wave','waifu', 'highfive','waifu', 'handhold', 'kill', 'happy','waifu', 'waifu', 'wink', 'poke','waifu', 'waifu', 'dance','waifu', 'cringe'];
   // const categories = ['waifu', 'smug', 'neko', 'shinobu', 'megumin','pat', 'cringe']; // use this for mostly images.jpg
    // Fetch random anime character
    const fetchAnimeCharacter = async () => {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)]; // generate random number to select from categories
        try {
            const response = await axios.get(`https://api.waifu.pics/sfw/${randomCategory}`);
            setCharacter(response.data); // Set the character data
        } catch (error) {
            console.error("Error fetching character:", error);
        }
    };

    // Fetch a random zen quote
    // Function to fetch quotes from either Quotable.io or ZenQuotes.io
    const fetchZenQuote = async () => {
        const useQuotable = Math.random() < 0.5; // Randomly decide which API to use (50% chance each)
        try {
            let response;
            if (useQuotable) {
                response = await fetch('https://api.quotable.io/quotes/random'); // use quotable api
                
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setQuote(data[0].content); // Extract the quote from Quotable.io
                setQuoteSource('Quotable.io'); // Set the source for loggi
            } else {
                response = await fetch('https://corsproxy.io/?https://zenquotes.io/api/random'); // Use a CORS proxy for zenquotes api
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setQuote(data[0].q); // Extract the quote from ZenQuotes.io
                setQuoteSource('ZenQuotes.io'); // Set the source for logging
            }
            console.log(`Quote Sorce: ${quoteSource}`); // log source api for the quotes retrieved
        } catch (error) {
            console.error("Error fetching quote:", error);
            setQuote("Failed to fetch quote.");
            setQuoteSource(''); // Reset source
        }
    };

    useEffect(() => {
        fetchAnimeCharacter();
        fetchZenQuote(); // Fetch a random quote on component mount
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '20px'}}>
            <h1>Anime Zen</h1>
            {character ? (
                <>
                    <img 
                        src={character.url} // Access the image URL from the fetched character data
                        alt="Random Anime Character" 
                        style={{ width: '1000px', height: 'auto' }} // Adjust size as needed
                    />
                    <div className="quote">
                      <h4>{quote || "Loading quote...."}</h4> {/* Display the quote */}
                    </div>
                    <button className="button" onClick={() => { fetchAnimeCharacter(); fetchZenQuote(); }}>New</button>
                    <footer>
                        Inspirational quotes provided by <a href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes API</a>
                    </footer>
                </>
            ) : (
                <p>Loading character image...</p>
            )}
            
            
        </div>
    );
}

export default App;
