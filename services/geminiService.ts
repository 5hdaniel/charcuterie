import { GoogleGenAI } from "@google/genai";

const CACHE_KEY_PREFIX = 'charcuterie_img_cache_v1_';

const getCachedImage = (itemName: string): string | null => {
  return localStorage.getItem(CACHE_KEY_PREFIX + itemName);
};

const cacheImage = (itemName: string, base64: string) => {
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + itemName, base64);
  } catch (e) {
    console.warn("Local storage full, cannot cache image", e);
  }
};

export const generateItemSketch = async (itemName: string, description: string): Promise<string | null> => {
  // 1. Check Cache
  const cached = getCachedImage(itemName);
  if (cached) return cached;

  // 2. Check API Key availability
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using the specialized prompt for the style requested
    const prompt = `A simple, minimalist pencil sketch drawing of ${itemName} (${description}). 
    Black graphite on a plain white background. 
    Hand-drawn aesthetic, artistic, rough sketch style, single object, centered. 
    No text, no labels. High contrast.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
         // Generate 1 image
      }
    });

    let imageUrl: string | null = null;

    // Iterate to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64EncodeString}`;
          break;
        }
      }
    }

    if (imageUrl) {
      cacheImage(itemName, imageUrl);
      return imageUrl;
    }
    
  } catch (error) {
    console.error("Error generating image for", itemName, error);
  }
  
  return null;
};