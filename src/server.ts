import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { z } from 'zod'; // Import zod directly here
import { Habit,User,Entry,Tag} from './db/schema.ts'; // Adjusted path to your schema
import authRoutes from './routes/authroutes'
import userRoutes from './routes/userRoutes'
import habitRoutes from './routes/habitRoutes'

const app = express();




// --- Global Middleware ---
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // AdminJS relies on inline scripts and styles to render elements in the browser
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
      },
    },
  }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/auth', authRoutes)

app.use('/api/users', userRoutes)
app.use('/api/habits', habitRoutes)

app.post('/test', (req, res) => {
    res.send("Server is receiving POST requests!");
});
app.get('/sanity-check', (req, res) => {
    res.send("If you see this, routing works!");
});

console.log('Mounting auth routes');





export default app;