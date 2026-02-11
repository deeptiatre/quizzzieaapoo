const mongoose = require('mongoose');
require('dotenv').config();
const QuizModal = require('./src/modals/quiz.modal');

async function updateQuizzes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const result = await QuizModal.updateMany(
            { quizType: 'normal' },
            { $set: { quizStatus: 'live' } }
        );

        console.log(`Updated ${result.modifiedCount} quizzes to 'live' status.`);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

updateQuizzes();
