import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [character, setCharacter] = useState(null);
    const [quote, setQuote] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [imageTags, setImageTags] = useState('');
    const [quoteSource, setQuoteSource] = useState(''); // track api source for logging
    const [animeSource, setAnimeSource] = useState(''); // track api source for logging
    const [error, setError] = useState('');
    const categories = ['waifu', 'neko', 'shinobu', 'megumin','megumin', 'waifu', 'cuddle', 'cry', 'waifu', 'hug', 'waifu', 'kiss', 'pat', 'waifu', 'smug','waifu','waifu', 'bonk', 'yeet', 'blush', 'smile', 'wave','waifu', 'highfive','waifu', 'handhold', 'kill', 'happy', 'waifu', 'wink','happy', 'poke','waifu', 'happy', 'dance','happy', 'cringe'];
   // const categories = ['waifu', 'smug', 'neko', 'shinobu', 'megumin','pat', 'cringe']; // use this for mostly images.jpg
    // Fetch random anime character
    const fetchAnimeCharacter = async () => {
        const animeRandom = Math.random() < 0.5;
        const randomCategory = categories[Math.floor(Math.random() * categories.length)]; // generate random number to select from categories
        try {
            let response;
            if (animeRandom) {
                response = await fetch('https://corsproxy.io/?https://pic.re/image');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const imageBlob = await response.blob(); // Get the image blob
                const imageUrl = URL.createObjectURL(imageBlob); // Create a local URL for the image blob
                setImageUrl(imageUrl); // Set the image URL
                setImageSource(response.headers.get('image_source')); // Get image source from headers
                setImageTags(response.headers.get('image_tags')); // Get image tags from headers
                setCharacter(null);
                setAnimeSource('Pic.re');
            } else {
                response = await axios.get(`https://api.waifu.pics/sfw/${randomCategory}`);
                setCharacter(response.data); // Set the character data
                setAnimeSource('waif.ioapi');
            }
            console.log(`Anime Image Source: ${animeSource}`);
        } catch (error) {
            console.error("Error fetching character:", error);
            setError("Failed to fetch random image.");
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
                        loading="lazy"
                        style={{ width: '1000px', height: 'auto' }} // Adjust size as needed
                        className="img-fluid"
                    />
                </>
                ) : (
                    <img 
                        src={imageUrl} 
                        alt="Random Anime" 
                        loading = "lazy"
                        className="img-fluid"
                        style={{ width: '1000px', height: 'auto' }} 
                    />
                )}


                    <div className="quote">
                      <h4>{quote || "Loading quote...."}</h4> {/* Display the quote */}
                    </div>
                   
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button className="btn btn-primary" onClick={() => { fetchAnimeCharacter(); fetchZenQuote(); }}>New</button>
                    <footer>
                        Inspirational quotes provided by <a href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes API</a>
                    </footer>
               
        </div>
    );
}

export default App;
