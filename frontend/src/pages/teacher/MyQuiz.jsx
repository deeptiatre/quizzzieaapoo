import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTeacherQuizzes } from "../../service/TeacherMyQuizService";

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadQuizzes = async () => {
    try {
      const data = await fetchTeacherQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error("Failed to load quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Quizzes</h1>

      {loading ? (
        <p>Loading...</p>
      ) : quizzes.length === 0 ? (
        <p className="text-gray-600">
          You haven’t created any quizzes yet.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-md shadow">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Difficulty</th>
                <th className="px-4 py-2 text-left">Questions</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id} className="border-b">
                  <td className="px-4 py-2">{quiz.title}</td>
                  <td className="px-4 py-2 font-medium">
                    {quiz.quizType === 'exam' ? (
                      <span className="text-purple-600 bg-purple-100 px-2 py-1 rounded text-xs">Exam</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">Normal Quiz</span>
                    )}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {quiz.diffcultylevel}
                  </td>
                  <td className="px-4 py-2">
                    {quiz.totalQuestions}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {quiz.quizStatus}
                  </td>
                  <td className="px-4 py-2 space-x-3">
                    <Link
                      to={`/teacher/quiz/${quiz._id}/manage`}
                      className="text-blue-600 hover:underline"
                    >
                      Manage
                    </Link>

                    {quiz.quizStatus === 'draft' && (
                      <>
                        {/* Publish is not in MyQuiz originally (Only Enable Exam was). 
                                 But user asked to strictly limit Enable Exam to Drafts. */}
                        <Link
                          to={`/teacher/quiz/${quiz._id}/enable-exam`}
                          className="text-green-600 hover:underline"
                        >
                          Enable Exam
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
