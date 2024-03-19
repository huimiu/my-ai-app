import { OpenAIStream, StreamingTextResponse } from "ai";

import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

// Create an OpenAI API client (that's edge friendly!)
const client = new OpenAIClient(
  "https://hui-ai-instance.openai.azure.com/",
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!)
);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Ask Azure OpenAI for a streaming chat completion given the prompt
  const response = await client.streamChatCompletions(
    "hui-gpt-4-32k",
    messages
  );

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
