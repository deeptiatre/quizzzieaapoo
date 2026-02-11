const mongoose = require('mongoose');
require('dotenv').config();
const QuizModal = require('./src/modals/quiz.modal');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quiz-app');

        const quizzes = await QuizModal.find({});
        console.log("--- START DEBUG ---");
        console.log(`Total Quizzes Found: ${quizzes.length}`);
        quizzes.forEach(q => {
            console.log(`[Quiz] Title: ${q.title}, CreatedBy: ${q.createdby} (${typeof q.createdby})`);
        });
        console.log("--- END DEBUG ---");

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

checkDB();
