import dotenv from 'dotenv';
dotenv.config();

if (!process.env.SWAP_DATABASE_URL) {
  throw new Error('SWAP_DATABASE_URL is not set in .env');
}

module.exports = {
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SWAP_DATABASE_URL,
  },
  tablesFilter: ['front-end_*'],
};
