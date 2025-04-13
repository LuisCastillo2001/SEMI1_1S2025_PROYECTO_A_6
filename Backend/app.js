import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('port',  3000);
app.get("/", (req, res) => {
    res.status(200).send("Bienvenido a la api en node.js del G6")
})
// Rutas
app.use('/api', userRoutes);

export default app;