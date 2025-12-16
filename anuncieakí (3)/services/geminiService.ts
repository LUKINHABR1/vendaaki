import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (title: string, category: string, condition: string): Promise<string> => {
  try {
    const prompt = `
      Crie uma descrição vendedora para um site de classificados (estilo OLX).
      Produto: ${title}
      Categoria: ${category}
      Condição: ${condition}
      
      Regras: Curto (máx 50 palavras), persuasivo, destaque benefícios. Use 1 emoji.
      Retorne apenas o texto.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Erro AI:", error);
    return "Ótima oportunidade! Produto em excelente estado e pronto para uso.";
  }
};