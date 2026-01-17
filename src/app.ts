import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.routes';
import usuariosRoutes from './routes/usuarios.routes';
import productosRoutes from './routes/productos.routes';
import mesasRoutes from './routes/mesas.routes';
import facturasRoutes from './routes/facturas.routes';
import reportesRoutes from './routes/reportes.routes';
import facturaPdfRoutes from './routes/factura-pdf.routes';
import ventasRapidasRoutes from './routes/ventasRapidas.routes'

const app = express();


// Configuración específica
app.use(cors({
  origin: ['http://localhost:5173', 'https://flordelotofront20.vercel.app'], // URL de tu frontend Vite
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/facturas', facturaPdfRoutes)
app.use('/api/ventas-rapidas', ventasRapidasRoutes)


export default app;
