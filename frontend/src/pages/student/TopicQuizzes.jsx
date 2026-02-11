import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizzesByTopic } from "../../service/quizService";
import QuizCard from "../../component/student/QuizCard";

const TopicQuizzes = () => {
    const { topic } = useParams();
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        getQuizzesByTopic(topic).then(res => {
            setQuizzes(res.data.quizzes || []);
        });
    }, [topic]);

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold">
                Topic: {topic}
            </h1>

            {quizzes.length === 0 ? (
                <p>No quizzes available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quizzes.map(q => (
                        <QuizCard key={q._id} quiz={q} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopicQuizzes;
