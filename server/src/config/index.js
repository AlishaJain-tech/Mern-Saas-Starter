import dotenv from 'dotenv';

   dotenv.config();

   const config = {
     port: process.env.PORT || 5000,
     nodeEnv: process.env.NODE_ENV || 'development',
     mongoUri: process.env.MONGO_URI,
     clientUrl: process.env.CLIENT_URL,
   };

   export default config;