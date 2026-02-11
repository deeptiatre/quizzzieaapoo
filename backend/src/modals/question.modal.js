const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
    quizID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',

        required: true

    },
    questiontext: {
        type: String,
        required: true

    },
    mark: {
        type: Number,
        required: true,
        default: 1


    },
    options: [
      {  text: { type: String, required: true },
        iscorrect : {  type: Boolean, required: true, default: false }
 }   ]
}, {
    timestamps: true,
})
const QuestionModal = mongoose.model('Question', questionSchema);
module.exports = QuestionModal;