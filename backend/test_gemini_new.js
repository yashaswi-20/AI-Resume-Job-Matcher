require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Using Key (first 5 chars):", key.substring(0, 5));
    
    try {
        const client = new GoogleGenAI({ apiKey: key });
        
        // The user suggested models.generateContent with 'contents' as a string
        const response = await client.models.generateContent({
            model: "gemini-1.5-flash", 
            contents: ["Hello! Respond only with 'OK'."] // Using array as is common in Node
        });
        
        console.log("Response text:", response.text);
    } catch (err) {
        console.error("Error status:", err.status);
        console.error("Error message:", err.message);
        if (err.data) console.error("Error data:", JSON.stringify(err.data));
    }
}

test();
