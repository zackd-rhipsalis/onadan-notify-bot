import https from 'https';
import { eventsub } from './eventsub.ts';

const PORT = process.env.PORT || 8080;

const server = https.createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('compulsory listen');
  res.end();
});

server.listen(PORT, () => eventsub());