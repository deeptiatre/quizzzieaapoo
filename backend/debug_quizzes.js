const mongoose = require('mongoose');
require('dotenv').config();
const QuizModal = require('./src/modals/quiz.modal');

async function checkQuizzes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.error("Connected to DB");

        const allQuizzes = await QuizModal.find({});
        console.error(`Total Quizzes: ${allQuizzes.length}`);

        const validQuizzes = await QuizModal.find({
            quizType: 'normal',
            quizStatus: 'live'
        });
        console.error(`Student Visible Quizzes (normal + live): ${validQuizzes.length}`);

        if (validQuizzes.length === 0) {
            console.error("--- SAMPLE QUIZZES ---");
            const sample = await QuizModal.find().limit(5);
            sample.forEach(q => {
                console.error(`ID: ${q._id} | Type: '${q.quizType}' | Status: '${q.quizStatus}' | Title: ${q.title}`);
            });
            console.error("---------------------");
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

checkQuizzes();
