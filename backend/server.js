require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');
const connectDB = require('../backend/src/config/db');
const router = require('../backend/src/routes/auth.routes');
const quizRouter = require('../backend/src/routes/quiz.routes');
const quizFetchrouter = require('../backend/src/routes/quiz.fetch.routes');
const submitrouter = require('./src/routes/attempt.submit.routes');
const attemptRouter = require('../backend/src/routes/attempt.route');
const leaderRouter = require('./src/routes/learderboard.routes');
const teacherRouter = require('./src/routes/teacher/teacherSide');
const { examStudentroutes } = require('./src/routes/student/student.routes');
const { profileRouter } = require('./src/routes/profile/getUpdateProfile');
const { studentDashboardRouter } = require('./src/routes/dashboard/studentDashboard');
const { teacherDashboardRouter } = require('./src/routes/dashboard/teacherDashboard');
const examCompletionJob = require('./src/service/exam/jobEamCompletion.service');

const app = express();

connectDB();

// Run exam completion check on startup and every 30 seconds
examCompletionJob();
setInterval(examCompletionJob, 30000);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookie());
app.use(express.json());


app.use("/api/auth", router);
app.use("/api/profile", profileRouter);
app.use("/api/quizzes/fetch", quizFetchrouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/attempt", submitrouter);
app.use("/api/attemptmy", attemptRouter)
app.use("/api/leaderBoard", leaderRouter)
app.use('/api/teacher', teacherRouter)
app.use('/api/exam', examStudentroutes)
app.use('/api/dashboard/student', studentDashboardRouter)
app.use('/api/dashboard/teacher', teacherDashboardRouter)
const Port = process.env.PORT || 4000;
app.listen(Port, () => {
  console.log(`Server is running on ports ${Port}`)
})