const QuizModal = require('../modals/quiz.modal');
const publishresultcontroller = async (req,res) => {
    try {
        const { quizID } = req.params;
        const {publishResult} = req.body;
        
        const quiz = await QuizModal.findById(quizID);
        if(!quiz){
            return res.status(404).json({
                message : "Quiz not found"
            });
        }

        quiz.publishResult = publishResult;
        await quiz.save();

        return res.status(200).json({
            message: `Quiz results ${publishResult ? 'published' : 'unpublished'} successfully`,
            publishResult: quiz.publishResult
        });

    } catch (error) {
        return res.status(500).json({   
            message: "publish result error",
            error: error.message,
          });
    }
}
module.exports = publishresultcontroller;