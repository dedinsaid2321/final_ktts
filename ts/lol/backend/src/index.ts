import express, { Application } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

const app: Application = express();
const PORT: number = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', userRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден'
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});