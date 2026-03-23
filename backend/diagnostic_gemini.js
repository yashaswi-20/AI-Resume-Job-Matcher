require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Using Key (first 10 chars):", key.substring(0, 10));
    
    try {
        const client = new GoogleGenAI({ apiKey: key });
        
        // Let's try gemini-1.5-flash as a fallback if -3 fails, but let's try -3 first as requested
        console.log("Attempting call with gemini-2.0-flash-exp (or similar stable)...");
        const response = await client.models.generateContent({
            model: "gemini-1.5-flash", 
            contents: "Hi, please respond with 'API IS WORKING'."
        });
        
        console.log("Success! API Response:", response.text);
    } catch (err) {
        console.error("Call failed!");
        if (err.status) console.error("Status:", err.status);
        console.error("Message:", err.message);
        if (err.data) console.error("Data:", JSON.stringify(err.data));
    }
}

test();
