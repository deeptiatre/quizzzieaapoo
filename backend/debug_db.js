const mongoose = require('mongoose');
require('dotenv').config();
const QuizModal = require('./src/modals/quiz.modal');
const UserModal = require('./src/modals/user.modal');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quiz-app'); // Adjust URI if needed
        console.log("Connected to DB");

        const quizzes = await QuizModal.find({});
        console.log(`Total Quizzes: ${quizzes.length}`);

        for (const quiz of quizzes) {
            console.log(`Quiz: ${quiz.title}, ID: ${quiz._id}, CreatedBy: ${quiz.createdby}`);
            const user = await UserModal.findById(quiz.createdby);
            console.log(`  -> Creator Valid? ${!!user}, Name: ${user ? user.name : 'Unknown'}`);
        }

        const users = await UserModal.find({ role: 'teacher' });
        console.log(`Total Teachers: ${users.length}`);
        users.forEach(u => console.log(`Teacher: ${u.name}, ID: ${u._id}`));

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

checkDB();
