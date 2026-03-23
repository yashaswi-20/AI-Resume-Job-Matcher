require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Using Key (first 10 chars):", key.substring(0, 10));
    
    try {
        const client = new GoogleGenAI({ apiKey: key });
        
        // Testing the specific structure suggested by the SDK exports
        const response = await client.models.generateContent({
            model: "gemini-2.0-flash", // Using a highly available stable model for testing
            contents: "Hi, please respond with 'API IS WORKING'."
        });
        
        console.log("Success! API Response:", response.text);
    } catch (err) {
        console.error("Call failed!");
        if (err.status) console.error("Status:", err.status);
        console.error("Message:", err.message);
        // Log the full error to see what's wrong (e.g. auth, quota, etc.)
    }
}

test();
