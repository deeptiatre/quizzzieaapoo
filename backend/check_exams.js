const mongoose = require('mongoose');
const QuizModal = require('./src/modals/quiz.modal');
require('dotenv').config();

const checkExams = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Quiz-Application"); // Fallback to local if env missing
        console.log("Connected to MongoDB for check");

        const exams = await QuizModal.find({ quizType: 'exam' });
        console.log(`Found ${exams.length} exams:`);

        exams.forEach(q => {
            console.log(`- Quiz ID: ${q._id}`);
            console.log(`  Title: ${q.title}`);
            console.log(`  Exam Code: '${q.examConfig?.examCode}'`); // Quotes to see spaces
            console.log(`  Status: ${q.quizStatus}`);
            console.log('---');
        });

        if (exams.length === 0) {
            console.log("No exams found! Check if 'quizType' is set to 'exam'.");
            // Check all quizzes
            const allQuizzes = await QuizModal.find({});
            console.log(`Total quizzes in DB: ${allQuizzes.length}`);
            allQuizzes.forEach(q => {
                if (q.quizType !== 'exam') {
                    console.log(`  [Non-Exam] ID: ${q._id}, Title: ${q.title}, Type: ${q.quizType}`);
                }
            });
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

checkExams();
