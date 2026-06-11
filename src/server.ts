import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { z } from 'zod'; // Import zod directly here
import { Habit,User,Entry,Tag} from './db/schema.ts'; // Adjusted path to your schema
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSSequelize from '@adminjs/sequelize'
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

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
})

// Initialize the dashboard options
const adminJs = new AdminJS({
  // Pass all the tables you want to view/edit on the UI dashboard
  resources: [User, Habit, Entry, Tag], 
  rootPath: '/admin', // The URL path where the UI will live
})

// Build the authenticated or open router wrapper
const adminRouter = AdminJSExpress.buildRouter(adminJs)

// Mount the dashboard UI right into your Express app configuration
app.use(adminJs.options.rootPath, adminRouter)

// --- Inline Zod Schemas ---
const createHabitSchema = z.object({
  userId: z.string().uuid({ message: "Invalid User ID format (Must be a UUID)" }),
  name: z.string().min(1, { message: "Name is required" }).max(100),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly'], { 
    message: "Frequency must be either 'daily', 'weekly', or 'monthly'"
  }),
  targetCount: z.number().int().positive().default(1),
});

const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  targetCount: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

// --- CRUD OPERATIONS WITH INLINE VALIDATION ---

// 1. CREATE (POST)
app.post('/habits', async (req, res) => {
    // Run data through Zod schema check
    const validation = createHabitSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            error: "Validation Failed",
            details: validation.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
    }

    try {
        // Use the validated, sanitized data from Zod
        const newHabit = await Habit.create(validation.data);
        
        return res.status(201).json({
            message: "Habit created successfully",
            data: newHabit
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// 2. READ ALL (GET)
app.get('/habits', async (req, res) => {
    try {
        const habits = await Habit.findAll();
        return res.status(200).json({
            message: "All habits retrieved successfully",
            data: habits
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// 3. READ ONE (GET)
app.get('/habits/:id', async (req, res) => {
    try {
        const habit = await Habit.findByPk(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }
        return res.status(200).json({ data: habit });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// 4. UPDATE (PUT)
app.put('/habits/:id', async (req, res) => {
    // Validate fields provided for updates
    const validation = updateHabitSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            error: "Validation Failed",
            details: validation.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
    }

    try {
        const habit = await Habit.findByPk(req.params.id);
        
        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        // Apply fields from our validated Zod data object onto the model instance
        Object.assign(habit, validation.data);
        await habit.save();

        return res.status(200).json({
            message: "Habit updated successfully",
            data: habit
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// 5. DELETE (DELETE)
app.delete('/habits/:id', async (req, res) => {
    try {
        const habit = await Habit.findByPk(req.params.id);
        
        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        await habit.destroy();
        return res.status(200).json({
            message: "Habit deleted successfully"
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

export default app;