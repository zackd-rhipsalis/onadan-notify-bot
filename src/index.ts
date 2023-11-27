// import http from 'http';
import { eventsub } from './eventsub.ts';

eventsub();

// const PORT = Number(process.env.PORT) || 8080;

// const server = http.createServer((_, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.write('<p>compulsory listen</p>');
//   res.end();
// });

// server.listen(PORT, eventsub);