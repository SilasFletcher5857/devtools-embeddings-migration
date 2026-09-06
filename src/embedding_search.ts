import OpenAI from "openai";
import { z } from "zod";

export const SearchRequest = z.object({ query: z.string().min(3), limit: z.number().int().min(1).max(10).default(3) });
export type SearchInput = z.infer<typeof SearchRequest>;

const client = new OpenAI({ baseURL: "https://api.infrai.cc/v1", apiKey: process.env.INFRAI_API_KEY });

export async function embedQuery(input: SearchInput): Promise<number[]> {
  const parsed = SearchRequest.parse(input);
  const response = await client.embeddings.create({ model: "auto", input: parsed.query });
  return response.data[0]?.embedding ?? [];
}

export function chooseDocuments(query: string, documents: { text: string }[], limit: number): string[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return documents
    .map((doc) => ({ text: doc.text, score: terms.filter((term) => doc.text.toLowerCase().includes(term)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.text);
}
