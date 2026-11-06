import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import generateCookedCourseRouter from './routes/generateCourseRoutes';
import chapterRouter from './routes/chapterRoutes';

const app = express();

if (process.env.NODE_ENV = 'development') app.use(morgan('dev'))

// CORS
app.use(cors());

// Essential Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/cookedcourse", generateCookedCourseRouter);
app.use("/api/v1/chapter-analysis", chapterRouter);

export default app;