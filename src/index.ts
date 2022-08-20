import dotenv from 'dotenv-safe';
import greet from './greet';

dotenv.config();

greet(process.env.OWNER_NAME ?? '');
