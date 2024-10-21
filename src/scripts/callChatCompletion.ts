import { OPENAI_API_KEY } from "../env";

export const callChatCompletion = async (
  setIsLoadingAIGeneration: (b: boolean) => void,
  AIGenerationRef: React.RefObject<HTMLTextAreaElement>,
) => {
  setIsLoadingAIGeneration(true);
  const message = "はじめまして！休日はよくカフェ巡りをしているんですか？";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful writing assistant." },
        {
          role: "user",
          content: `Generate a next phrase to follow "${message}". Just provide the replacement, no additional text.`,
        },
      ],
      stream: true,
    }),
  });

  if (!response.body) throw new Error("ReadableStream not supported");

  const reader = response.body.getReader();

  const textarea = AIGenerationRef.current;
  if (textarea === null) {
    return;
  }

  const decoder = new TextDecoder();
  const loopRunner = true;
  let partialMessage = "";

  while (loopRunner) {
    // Here we start reading the stream, until its done.
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    const decodedChunk = decoder.decode(value, { stream: true });
    // The streamed data may contain multiple JSON objects, separated by newlines.
    const lines = decodedChunk.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      // Each line may begin with "data: ", we need to remove that prefix.
      if (line.startsWith("data: ")) {
        const jsonData = line.replace("data: ", "");

        // Ignore "[DONE]" message.
        if (jsonData === "[DONE]") {
          break;
        }

        try {
          // Parse the JSON data.
          const parsedData = JSON.parse(jsonData);
          const content = parsedData.choices[0]?.delta?.content;

          // If there is new content, append it to the textarea.
          if (content) {
            partialMessage += content;
            textarea.value += content;
          }
        } catch (error) {
          console.error("Failed to parse streamed data:", error);
        }
      }
    }
  }
  setIsLoadingAIGeneration(false);
};
