import { QwenAuthPlugin } from "../../src/index.ts";

async function testChatRequest() {
  console.log("--- 🧪 Testing Qwen Chat Request ---");
  
  try {
    const plugin = await QwenAuthPlugin({ client: {} });
    
    // Call loader to get the fetch implementation
    const auth = await plugin.auth.loader(() => {}, { models: {} });
    
    console.log("Using Base URL:", auth.baseURL);
    
    const messages = [
      { role: "user", content: "Olá, você é o Qwen 3.6 Plus? Responda com uma frase curta." }
    ];

    console.log("Sending chat request...");
    const response = await auth.fetch(`${auth.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "coder-model",
        messages,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("\n--- 🤖 RESPONSE ---");
    console.log(data.choices[0].message.content);
    console.log("-------------------\n");
    
    console.log("✅ CHAT REQUEST SUCCESSFUL!");

  } catch (error) {
    console.error("\n❌ ERROR DURING CHAT REQUEST:", error);
  }
}

testChatRequest();
