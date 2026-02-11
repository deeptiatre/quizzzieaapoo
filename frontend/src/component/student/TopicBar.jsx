import { useNavigate } from "react-router-dom";

const TopicBar = ({ quizzes }) => {
  const navigate = useNavigate();

  // Extract unique topics
  const uniqueTopics = new Map();

  quizzes.forEach(q => {
    if (q.topic) {
      const normalized = q.topic.trim().toLowerCase();
      if (!uniqueTopics.has(normalized)) {
        uniqueTopics.set(normalized, q.topic.trim());
      }
    }
  });

  const topics = Array.from(uniqueTopics.values()).sort();

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {topics.length > 0 && <span className="text-sm font-extrabold text-v-text-muted uppercase tracking-wider mr-2">Topics:</span>}
      {topics.map(topic => (
        <button
          key={topic}
          onClick={() => navigate(`/student/quizzes/topic/${topic}`)}
          className="px-4 py-2 bg-v-bg-card border-2 border-v-border-color hover:border-v-blue-primary hover:text-v-blue-primary text-v-text-main rounded-xl text-sm font-bold transition-all transform hover:scale-105 active:scale-95"
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicBar;
