import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../service/api";
import { submitQuiz } from "../../service/quizService";
import QuestionCard from "../../component/student/QuestionCard";

const QuizAttempt = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        api.get(`/attempt/${attemptId}/questions`).then(res => {
            setQuestions(res.data.questions);
        });
    }, [attemptId]);

    const handleSelect = (optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questions[index]._id]: optionId
        }));
    };

    const handleNext = () => {
        setIndex(prev => prev + 1);
    };

    const handleSubmit = async () => {
        const formatted = Object.entries(answers).map(
            ([questionID, selectedOption]) => ({
                questionID,
                selectedOption
            })
        );

        await submitQuiz(attemptId, formatted);
        navigate(`/student/quiz/result/${attemptId}`);
    };

    if (!questions.length) return <p>Loading...</p>;

    return (
        <div className="space-y-4">
            <QuestionCard
                question={questions[index]}
                onSelect={handleSelect}
            />

            {index < questions.length - 1 ? (
                <button onClick={handleNext}>Next</button>
            ) : (
                <button onClick={handleSubmit}>Submit</button>
            )}
        </div>
    );
};

export default QuizAttempt;
