const mongoose = require('mongoose');
require('dotenv').config();
const QuizModal = require('./src/modals/quiz.modal');
const QuestionModal = require('./src/modals/question.modal');
const AttemptModal = require('./src/modals/attempt.modal');
const UserModal = require('./src/modals/user.modal');
const { submitAttemptService } = require('./src/service/submitAttemptService');

// CONSTANTS
const TEACHER_ID = '694ec8b0b8592ef2d85681fb'; // Using the ID we found earlier
const STUDENT_ID = '697fa1b296d36e131191b939'; // Using the ID from logs

async function debugScoring() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Create a dummy quiz
        const quiz = await QuizModal.create({
            title: "Debug Score Quiz",
            discription: "Testing scoring logic",
            timelimit: 10,
            totalmarks: 10,
            diffcultylevel: "easy",
            topic: "Debug",
            createdby: TEACHER_ID,
            quizType: 'normal',
            quizStatus: 'live'
        });
        console.log("Quiz Created:", quiz._id);

        // 2. Add a question
        const question = await QuestionModal.create({
            quizID: quiz._id,
            questiontext: "What is 2 + 2?",
            mark: 10,
            options: [
                { text: "3", iscorrect: false },
                { text: "4", iscorrect: true }, // Correct Answer
                { text: "5", iscorrect: false }
            ]
        });
        console.log("Question Added:", question._id);

        // Identify the correct option ID
        const correctOption = question.options.find(o => o.text === "4");
        const correctOptionID = correctOption._id.toString();
        console.log("Correct Option ID:", correctOptionID);

        // 3. Start Attempt (Student)
        const attempt = await AttemptModal.create({
            userID: STUDENT_ID,
            quizID: quiz._id,
            questionIds: [question._id],
            startedAt: Date.now()
        });
        console.log("Attempt Started:", attempt._id);

        // 4. Submit Attempt with Correct Answer (sending ID as frontend does)
        console.log("Submitting with Option ID:", correctOptionID);

        const submittedAttempt = await submitAttemptService({
            attemptId: attempt._id,
            userId: STUDENT_ID,
            answers: [{
                questionID: question._id.toString(),
                selectedOption: correctOptionID // Frontend sends ID!
            }],
            submitReason: 'manual',
            autoSubmitted: false
        });

        console.log("\n--- RESULT ---");
        console.log(`Score: ${submittedAttempt.score} / 10`);
        console.log("Details:", JSON.stringify(submittedAttempt.answers, null, 2));

        if (submittedAttempt.score === 10) {
            console.log("SUCCESS: Scoring works correctly!");
        } else {
            console.log("FAILURE: Score is 0. Logic is comparing Text vs ID?");
        }

        // Cleanup
        await QuizModal.findByIdAndDelete(quiz._id);
        await QuestionModal.findByIdAndDelete(question._id);
        await AttemptModal.findByIdAndDelete(attempt._id);

    } catch (error) {
        console.error("ERROR:", error);
    } finally {
        await mongoose.disconnect();
    }
}

debugScoring();
