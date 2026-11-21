import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(
        `CloudVault server running on port ${env.PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start CloudVault:", error);
    process.exitCode = 1;
  }
}

void startServer();