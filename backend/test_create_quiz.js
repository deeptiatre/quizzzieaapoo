const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const TEACHER_ID = '694ec8d1b8592ef2d8'; // From previous step
const SECRET = process.env.JWT_SECRET || 'GJFHERdghrythdrth'; // Fallback if env not loaded correctly, though dotenv is used

async function testCreateQuiz() {
    try {
        // 1. Generate Token
        const token = jwt.sign({ userId: TEACHER_ID, role: 'teacher' }, SECRET, { expiresIn: '1h' });
        console.error("Generated Token for Teacher ID:", TEACHER_ID);

        // 2. Payload
        const payload = {
            title: "Debug Quiz 1",
            discription: "Created via debug script",
            timelimit: 15,
            totalmarks: 100,
            diffcultylevel: "medium"
        };

        // 3. Request
        const response = await axios.post('http://localhost:3000/api/quizzes/create', payload, {
            headers: {
                'Cookie': `token=${token}`, // Auth middleware reads from req.cookies.token
                // api.js sends Authorization header, but backend middleware checks req.cookies.token!
                // Wait, let's double check auth.middleware.js
            }
        });

        console.error("Success:", response.data);

    } catch (error) {
        if (error.response) {
            console.error("Error Status:", error.response.status);
            console.error("Error Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

testCreateQuiz();
