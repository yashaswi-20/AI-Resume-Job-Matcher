require('dotenv').config();
const genai = require('@google/genai');

async function inspect() {
    console.log("Package Exports:", Object.keys(genai));
    
    if (genai.GoogleGenAI) {
        try {
            const client = new genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            console.log("Client Instance Keys:", Object.keys(client));
            if (client.models) {
                console.log("Client Models Keys:", Object.keys(client.models));
            }
            
            console.log("\nAttempting a small call...");
            const response = await client.models.generateContent({
                model: "gemini-1.5-flash", // Using a stable model name
                contents: "Say 'Success'"
            });
            console.log("Response Object Keys:", Object.keys(response));
            console.log("Response text:", response.text);
        } catch (e) {
            console.log("Detailed Error:", e);
        }
    }
}

inspect();
