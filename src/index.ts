import express from 'express';
import cors from 'cors';
import { manifestRoute } from './routes/manifest.js';
import { gatewayRoute } from './routes/gateway.js';
import { toolRoute } from './routes/tool.js';
import { pluginListRoute } from './routes/plugin-list.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
export const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'x-lobe-chat-auth',
      'x-lobe-plugin-settings',
      'x-lobe-trace',
    ],
  })
);
app.use(express.json());
app.use(express.text());

app.get(pluginListRoute.route, pluginListRoute);
app.post(gatewayRoute.route, gatewayRoute);

app.get(manifestRoute.route, manifestRoute);
app.post(toolRoute.route, (req, res) => {
  toolRoute(req, res);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});
