import express from 'express';
import http from 'http';
import cors from 'cors';
import publicRoutes from './api/public.routes';
import jobsRoutes from './api/jobs.routes';
import dashboardRoutes from './api/dashboard.routes';
import { SocketService } from './socket/socket.service';

const app = express();
const server = http.createServer(app);
const socketService = new SocketService(app);

app.use(cors());
app.use(express.json());

app.use('/api/public', publicRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/dashboard', dashboardRoutes);

socketService.init(server);

const PORT = process.env.PORT ?? 4000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});