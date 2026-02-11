const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizID: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    questionIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        }
    ],
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    score: { type: Number, default: 0 },
    answers: [
        {
            questionID: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
            selectedOption: { type: String },
            isCorrect: {
                type: Boolean, default: false
            }
        }
    ],
    tabSwitchCount: { type: Number, default: 0 },
    autoSubmitted: { type: Boolean, default: false },
    submitReason: {
        type: String,
        enum: ['timeUp', 'manual', 'admin', 'tabswitch'],
        default: 'manual'
    }

}, {
    timestamps: true
});
attemptSchema.index({ quizID: 1, userID: 1 }, { unique: true });
attemptSchema.index({ score: -1, endedAt: 1 });

const attemptmodal = mongoose.model('Attempt', attemptSchema);
module.exports = attemptmodal;