import dns from "node:dns/promises";
import app from './src/app.js';
import connectDB from './src/config/db.js';
import config from './src/config/index.js';

// Force Node to use Cloudflare's DNS resolver for this process.
// Fixes SRV lookup failures on networks/ISPs with broken DNS resolution.
dns.setServers(["1.1.1.1"]);

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  });
};

startServer();