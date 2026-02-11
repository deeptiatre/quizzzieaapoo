const mongoose = require('mongoose');
require('dotenv').config();
const UserModal = require('./src/modals/user.modal');

async function findTeacher() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const teacher = await UserModal.findOne({ role: 'teacher' });
        if (teacher) {
            console.log("TEACHER_ID:" + teacher._id.toString());
        } else {
            console.log("NO_TEACHER_FOUND");
        }
    } catch (error) {
        console.log("ERROR:" + error.message);
    } finally {
        await mongoose.disconnect();
    }
}
findTeacher();
