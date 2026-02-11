const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const TEACHER_ID = '694ec8b0b8592ef2d85681fb'; // Valid ID found in DB
const SECRET = process.env.JWT_SECRET || 'GJFHERdghrythdrth';

// 1. Generate Token
const token = jwt.sign({ userId: TEACHER_ID, role: 'teacher' }, SECRET, { expiresIn: '1h' });
console.log("Generated Token:", token);

// 2. Payload
const payload = JSON.stringify({
    title: "Debug Quiz Native",
    discription: "Created via native debug script",
    timelimit: 15,
    totalmarks: 100,
    diffcultylevel: "medium",
    topic: "Debugging"
});

// 3. Request Options
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/quizzes/create',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Testing Header Auth
    }
};

// 4. Send Request
const req = http.request(options, (res) => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("Response Body:", data);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(payload);
req.end();
