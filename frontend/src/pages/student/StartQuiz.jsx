import { useParams, useNavigate } from "react-router-dom";
import { startQuiz } from "../../service/quizService";

const StartQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const handleStart = async () => {
        const res = await startQuiz(quizId);
        navigate(`/student/quiz/attempt/${res.data.attemptId}`);
    };

    return (
        <div className="flex justify-center mt-20">
            <button
                onClick={handleStart}
                className="bg-green-600 text-white px-6 py-2 rounded"
            >
                Begin Quiz
            </button>
        </div>
    );
};

export default StartQuiz;
