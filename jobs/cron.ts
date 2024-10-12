import cron from "node-cron";
import axios from "axios";

const BACKEND_URL = "https://aimpoint-api.onrender.com/posts";

// Schedule a job to run every 14 minutes
cron.schedule("*/14 * * * *", async () => {
  try {
    // Make a request to the backend
    await axios.get(BACKEND_URL);
    console.log("Backend called successfully");
  } catch (error) {
    console.error("Error calling backend:", error);
  }
});
