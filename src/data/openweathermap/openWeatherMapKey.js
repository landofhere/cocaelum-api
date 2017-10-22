import dotenv from 'dotenv';

dotenv.config({ silent: true });

const { OPENWEATHER_API_KEY } = process.env;

export default OPENWEATHER_API_KEY;
