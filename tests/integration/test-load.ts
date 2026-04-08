import { QwenAuthPlugin } from "./src/index";

async function test() {
  console.log("Loading plugin...");
  try {
    const plugin = await QwenAuthPlugin({ client: { auth: { set: async () => {} } } });
    console.log("Plugin loaded successfully!");
    console.log("Provider ID:", plugin.auth.provider);
    console.log("Auth methods:", plugin.auth.methods.map(m => m.label));
    
    // Simulate loader call (this is where fetch() happens)
    if (plugin.auth.loader) {
      console.log("\nSimulating auth.loader call...");
      const mockGetAuth = async () => ({ access: "test" });
      const result = await plugin.auth.loader(mockGetAuth, { models: {} });
      console.log("Loader call succeeded!");
      console.log("Base URL:", result.baseURL);
    }
  } catch (error) {
    console.error("FAILED TO LOAD PLUGIN:", error);
  }
}

test();
