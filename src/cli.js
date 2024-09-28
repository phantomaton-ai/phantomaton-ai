import 'dotenv/config';
import { main as taskMain } from './tasks.js';
import { main as chatMain } from './chat.js';

const [, , mode, ...args] = process.argv;

if (mode === '--tasks') {
  taskMain();
} else {
  chatMain();
}