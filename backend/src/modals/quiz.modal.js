const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    discription: {
        type: String,
        required: true

    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    timelimit: {
        type: Number,
        required: true,
        default: 10
    },
    totalmarks: {
        type: Number,
        required: true,
        default: 0

    },
    diffcultylevel: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy'
    },
    quizType: {
        type: String,
        enum: ['normal', 'exam'],
        default: 'normal'
    },
    quizStatus: {
        type: String,
        enum: ['draft', 'upcoming', 'live', 'completed', 'normal'],
        default: 'draft'
    },
    examConfig: {

        examCode: { type: String },
        startTime: Date,
        endTime: Date,
        durationMinutes: Number,
        autosubmit: {
            timeEnd: { type: Boolean, default: true },
            tabSwitch: { type: Boolean, default: true },
            copyPaste: { type: Boolean, default: false }
        },
        maxTabSwitch: { type: Number, default: 3 },
    },
    publishResults: {
        type: Boolean,
        default: false
    },
    isPractice: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
})

quizSchema.index({ quizType: 1, quizStatus: 1 });
quizSchema.index({ "examConfig.startTime": 1 });

const QuizModal = mongoose.model('Quiz', quizSchema);

module.exports = QuizModal;