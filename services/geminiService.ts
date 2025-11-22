import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
    // Safely access process.env
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        return process.env.API_KEY;
    }
    throw new Error("API Key is missing. Please ensure 'process.env.API_KEY' is configured in your environment.");
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const summarizePdf = async (file: File, promptText: string = "Summarize this document"): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const base64Data = await fileToBase64(file);
  const base64Content = base64Data.split(',')[1];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: file.type, data: base64Content } },
          { text: promptText }
        ]
      }
    });

    return response.text || "No summary generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message && error.message.includes('API key')) {
        throw new Error("Invalid or missing API Key.");
    }
    throw new Error("Failed to analyze PDF. The file might be too large or encrypted.");
  }
};

export const convertPdfToWordContent = async (file: File): Promise<Blob> => {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    const base64Data = await fileToBase64(file);
    const base64Content = base64Data.split(',')[1];

    // Prompt to generate HTML structure compatible with Word
    const prompt = `
        You are a professional document converter. Convert the attached PDF file into clean HTML code that can be opened in Microsoft Word.
        
        Requirements:
        1. Extract all text, preserving paragraphs, headers (h1, h2, etc.), and lists.
        2. If there are tables, represent them as HTML tables.
        3. Do NOT include markdown code fencing (like \`\`\`html). Return ONLY the raw HTML code starting with <html>.
        4. Add basic inline CSS styling for a clean, professional look (font-family: Calibri, sans-serif).
        5. Ensure the output is a complete HTML document with <html>, <head>, and <body> tags.
        6. Do not include any explanations, just the HTML code.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: file.type, data: base64Content } },
                    { text: prompt }
                ]
            }
        });

        let htmlContent = response.text || "";
        
        // Clean up if the model added markdown blocks despite instructions
        htmlContent = htmlContent.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```$/g, '');

        // Create a blob with Word MIME type
        return new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
        });
    } catch (error: any) {
        console.error("Gemini Conversion Error:", error);
        if (error.message && error.message.includes('API key')) {
            throw new Error("Invalid or missing API Key.");
        }
        throw new Error("Failed to convert PDF to Word. Please try again.");
    }
};