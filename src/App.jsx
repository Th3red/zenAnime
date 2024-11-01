import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [character, setCharacter] = useState(null);
    const [quote, setQuote] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [locationName, setLocationName] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [imageTags, setImageTags] = useState('');
    const [quoteSource, setQuoteSource] = useState(''); // track api source for logging
    const [animeSource, setAnimeSource] = useState(''); // track api source for logging
    const [error, setError] = useState('');
    const categories = ['waifu', 'neko', 'shinobu','smile','smile','smile','megumin','cry', 'megumin','megumin', 'waifu', 'cuddle', 'cry', 'waifu', 'hug', 'waifu', 'kiss','smug','smug','smug', 'pat', 'waifu', 'smug','waifu','waifu', 'bonk', 'smug','yeet', 'blush', 'smile', 'wave','waifu', 'highfive','waifu', 'handhold', 'kill', 'happy', 'waifu', 'wink','happy', 'poke','waifu', 'happy', 'dance','happy', 'cringe'];
    // const categories = ['waifu', 'smug', 'neko', 'shinobu', 'megumin','pat', 'cringe']; // use this for mostly images.jpg
    const [weather, setWeather] = useState(null);
    // Map weather code to description
    const interpretWeatherCode = (code) => {
        const codeMap = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Drizzle (light)",
            53: "Drizzle (moderate)",
            55: "Drizzle (dense)",
            56: "Freezing drizzle (light)",
            57: "Freezing drizzle (dense)",
            61: "Rain (slight)",
            63: "Rain (moderate)",
            65: "Rain (heavy)",
            66: "Freezing rain (light)",
            67: "Freezing rain (heavy)",
            71: "Snowfall (slight)",
            73: "Snowfall (moderate)",
            75: "Snowfall (heavy)",
            77: "Snow grains",
            80: "Rain showers (slight)",
            81: "Rain showers (moderate)",
            82: "Rain showers (violent)",
            85: "Snow showers (slight)",
            86: "Snow showers (heavy)",
            95: "Thunderstorm (slight or moderate)",
            96: "Thunderstorm with hail (slight)",
            99: "Thunderstorm with hail (heavy)"
        };
        return codeMap[code] || "Unknown weather condition";
    };
    
    // Fetch random anime character
    const fetchAnimeCharacter = async () => {
        const animeRandom = Math.random() < 0.2;
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
        
        const useQuotable = Math.random() < 0.01; // Randomly decide which API to use (1% chance to choose quotable API)
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
    

    // Fetch weather data
    const fetchWeather = async (latitude, longitude) => {
        try {
            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    current: 'temperature_2m,weather_code',
                    timezone: 'auto',
                    forecast_days: 1,
                    models: 'best_match',
                }
            });
            setWeather(response.data); // Adjust based on desired data
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };
    const getLocationAndFetchWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude); // Fetch weather using current location
                    fetchLocationName(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    const defaultLatitude = 39.7392;
                    const defaultLongitude = -104.9847;
                    fetchWeather(defaultLatitude, defaultLongitude); // Default to Denver, CO
                    fetchLocationName(defaultLatitude, defaultLongitude); // Fetch location name for default location
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            console.log("OpenCage API Key:", process.env.REACT_APP_OPENCAGE_API_KEY);
            const defaultLatitude = 39.7392;
            const defaultLongitude = -104.9847;
            fetchWeather(defaultLatitude, defaultLongitude); // Default to Denver, CO
            fetchLocationName(defaultLatitude, defaultLongitude);
        }
    };
   // Fetch the location name using reverse geocoding
   const fetchLocationName = async (latitude, longitude) => {
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                key: process.env.REACT_APP_OPENCAGE_API_KEY, // Replace with your OpenCage API key
                q: `${latitude},${longitude}`,
                language: 'en'
            }
        });

        const data = response.data.results[0].components;
        const location = response.data.results[0].formatted;
        //const city = data.city || data.town || data.village || data.county || location || "City not found";
        const city = data.city;
        const zipCode = data.postcode;

        // If city is not found, try to get city from zip code
        if (!city && zipCode) {
            const cityFromZip = await getCityFromZip(zipCode);
            setLocationName(cityFromZip);
        } else {
            setLocationName(city);
        }
    } catch (error) {
        console.error("Error fetching location name:", error);
        setLocationName("Unknown location");
    }
};

const getCityFromZip = async (zipCode) => {
    try {
        const response = await axios.get(`https://api.zippopotam.us/us/${zipCode}`);
        if (response.status === 200) {
            const city = response.data.places[0]['place name'];
            return city;
        } else {
            return "City not found for the given zip code.";
        }
    } catch (error) {
        console.error("Error fetching city from zip code:", error);
        return "Unknown city";
    }
};


    useEffect(() => {
        fetchAnimeCharacter();
        fetchZenQuote(); // Fetch a random quote on component mount
        getLocationAndFetchWeather();
    }, []);
 
    return (
        <div className="main-container">
            <h1>Anime Zen</h1>

            <div className="image-container">
                {character ? (
                    <img
                        src={character.url}
                        alt="Random Anime Character"
                        loading="lazy"
                        style={{ width: '100%', maxHeight: '80vh', objectFit: 'cover', filter: 'contrast(150%) opacity(90%) brightness(90%) blur(0.2px) saturate(80%)',background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
                            backgroundBlendMode: 'multiply' }}
                        className="img-fluid"
                    />
                ) : (
                    <img
                        src={imageUrl}
                        alt="Random Anime"
                        loading="lazy"
                        style={{ width: '100%', maxHeight: '80vh', objectFit: 'cover', filter: 'contrast(150%) opacity(90%) brightness(90%) blur(0.3px) saturate(80%)',background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
                            backgroundBlendMode: 'multiply' }}
                        
                        className="img-fluid"
                    />
                )}
                {weather ? (
                    <div className="temperature-overlay">
                        <p className="shiny-text temperature-text">{weather.current?.temperature_2m || "No Data"}°C</p>
                        <p>{locationName || "Loading location..."}</p>
                        <p className="shiny-text weather-code-text">{interpretWeatherCode(weather.current?.weather_code)}</p>
                    </div>
                ):(<p></p>)}
            </div>

            <div className="quote">
                <h4 className="quote-text">{quote || "Loading quote...."}</h4>
            </div>
                   
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button className="btn btn-primary" onClick={() => { fetchAnimeCharacter(); fetchZenQuote(); getLocationAndFetchWeather(); }}>New</button>
                    <footer>
                        Inspirational quotes provided by <a href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes API</a>
                    </footer>
               
        </div>
    );
}

export default App;
