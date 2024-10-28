// server.mjs
// to run server.js
// server.mjs
import express from 'express';
import https from 'https';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 1000;

// Route to fetch a random quote
app.get('/quote', (req, res) => {
    const options = {
        hostname: 'zenquotes.io',
        path: '/api/random',
        method: 'GET',
    };

    https.get(options, (response) => {
        let data = '';

        // Collect data chunks
        response.on('data', (chunk) => {
            data += chunk;
        });

        // Process and send data on end of response
        response.on('end', () => {
            try {
                const quote = JSON.parse(data);
                res.json(quote); // Send the quote as JSON
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.status(500).send("Error parsing quote response.");
            }
        });
    }).on('error', (error) => {
        console.error("Error with the request:", error);
        res.status(500).send("Error fetching quote.");
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Route to fetch a random quote
/*app.get('/quote', (req, res) => {
    const options = {
        hostname: 'zenquotes.io',
        path: '/api/random',
        method: 'GET',
    };

    https.get(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const quote = JSON.parse(data);
                res.json(quote);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.status(500).send("Error fetching quote");
            }
        });
    }).on('error', (error) => {
        console.error("Error with the request:", error);
        res.status(500).send("Error fetching quote");
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});*/
