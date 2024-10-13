import cron from "cron";
import https from "https";

const backendUrl: string = "https://aimpoint-api.onrender.com/posts";

// Runs every 14 minutes to keep the backend alive
const job = new cron.CronJob("*/14 * * * *", () => {
  console.log("Restarting server");

  // Perform an HTTPS GET request to hit any backend API
  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Server restarted");
      } else {
        console.error(
          `Failed to restart server with status code: ${res.statusCode}`
        );
      }
    })
    .on("error", (err: Error) => {
      console.error("Error during Restart:", err.message);
    });
});

export default job;
