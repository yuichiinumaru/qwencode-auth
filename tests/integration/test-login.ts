import { QwenAuthPlugin } from "../../src/index.ts";

async function testLoginFlow() {
  console.log("--- 🧪 Testing Qwen Auth Plugin Login Flow ---");
  
  try {
    const plugin = await QwenAuthPlugin({ 
      client: { 
        auth: { 
          set: async (creds: any) => {
            console.log("\n[CALLBACK] OpenCode would save these credentials:", JSON.stringify(creds, null, 2));
          } 
        } 
      } 
    });

    const oauthMethod = plugin.auth.methods.find(m => m.type === 'oauth');
    if (!oauthMethod) {
      throw new Error("No OAuth method found in plugin!");
    }

    console.log("Starting authorization flow...");
    const authResult = await oauthMethod.authorize();

    console.log("\n------------------------------------------------");
    console.log("🔗 AUTH URL: ", authResult.url);
    console.log("📋 INSTRUCTIONS: ", authResult.instructions);
    console.log("------------------------------------------------\n");

    console.log("Waiting for user authorization (polling)...");
    const finalResult = await authResult.callback();

    if (finalResult.type === 'success') {
      console.log("\n✅ LOGIN SUCCESSFUL!");
      console.log("Access Token (first 20 chars):", finalResult.access.substring(0, 20) + "...");
    } else {
      console.log("\n❌ LOGIN FAILED or TIMED OUT.");
    }

  } catch (error) {
    console.error("\n❌ ERROR DURING LOGIN FLOW:", error);
  }
}

testLoginFlow();
