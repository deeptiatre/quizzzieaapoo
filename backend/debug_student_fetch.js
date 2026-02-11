const mongoose = require('mongoose');
require('dotenv').config();
const QuizModal = require('./src/modals/quiz.modal');

async function debugStudentFetch() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        console.log("Simulating Student Quiz Fetch...");
        const quizzes = await QuizModal.find({
            quizType: 'normal',
            quizStatus: 'live'
        }).select("title discription timelimit totalmarks diffcultylevel topic");

        console.log(`Query: { quizType: 'normal', quizStatus: 'live' }`);
        console.log(`Found ${quizzes.length} quizzes.`);

        quizzes.forEach(q => {
            console.log(`- [${q._id}] ${q.title} (${q.quizStatus})`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

debugStudentFetch();
