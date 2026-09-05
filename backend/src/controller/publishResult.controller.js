const QuizModal = require('../modals/quiz.modal');
const publishresultcontroller = async (req,res) => {
    try {
        const { quizID } = req.params;
        const publishResults = req.body.publishResults !== undefined ? req.body.publishResults : req.body.publishResult;
        
        const quiz = await QuizModal.findById(quizID);
        if(!quiz){
            return res.status(404).json({
                message : "Quiz not found"
            });
        }

        quiz.publishResults = publishResults;
        await quiz.save();

        return res.status(200).json({
            message: `Quiz results ${publishResults ? 'published' : 'unpublished'} successfully`,
            publishResults: quiz.publishResults
        });

    } catch (error) {
        return res.status(500).json({   
            message: "publish result error",
            error: error.message,
          });
    }
}
module.exports = publishresultcontroller;