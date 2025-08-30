
import { GoogleGenAI, Modality } from "@google/genai";
import type { ProductImage, ModelConfig, GeneratedImageData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (config: ModelConfig): string => {
  return `Create a high-resolution, photorealistic image of a ${config.age} year old, ${config.ethnicity}, ${config.gender} model.
The model should be wearing the provided product naturally.
The setting is: ${config.setting}.
Additional details: ${config.details}.
The final image should be a professional, commercial-quality product photograph. Focus on the model and the product they are wearing. Do not include any text or logos.`;
};

export const generateModelImage = async (
  productImage: ProductImage,
  config: ModelConfig
): Promise<GeneratedImageData> => {
  const model = 'gemini-2.5-flash-image-preview';

  const prompt = buildPrompt(config);

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            data: productImage.base64,
            mimeType: productImage.mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });
  
  const parts = response.candidates?.[0]?.content?.parts;

  if (!parts) {
    throw new Error('Invalid response from Gemini API.');
  }

  let imageUrl: string | null = null;
  let description: string = "AI-generated model image.";

  for (const part of parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    } else if (part.text) {
      // Sometimes the model provides a description, which we can use.
      description = part.text;
    }
  }

  if (!imageUrl) {
    throw new Error('API did not return an image. It might have been blocked due to safety settings.');
  }

  return { imageUrl, description };
};
