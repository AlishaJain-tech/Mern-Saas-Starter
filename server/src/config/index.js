import dotenv from 'dotenv';

   dotenv.config();

   const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL,
  jwtSecret: process.env.JWT_SECRET, // add this line
};

   export default config;