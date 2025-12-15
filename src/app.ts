import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import usuariosRoutes from './routes/usuarios.routes';
import productosRoutes from './routes/productos.routes';
import mesasRoutes from './routes/mesas.routes';
import facturasRoutes from './routes/facturas.routes';
import reportesRoutes from './routes/reportes.routes';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/reportes', reportesRoutes);


export default app;
