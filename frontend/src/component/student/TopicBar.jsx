const TopicBar = ({ quizzes, selectedTopic = "All", onSelectTopic }) => {
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
      <button
        type="button"
        onClick={() => onSelectTopic && onSelectTopic("All")}
        className={`px-4 py-2 border-2 rounded-xl text-sm font-bold transition-all transform hover:scale-105 active:scale-95 ${
          selectedTopic === "All"
            ? "bg-v-blue-primary border-v-blue-primary text-white shadow-md shadow-blue-500/20"
            : "bg-v-bg-card border-v-border-color text-v-text-main hover:border-v-blue-primary hover:text-v-blue-primary"
        }`}
      >
        All
      </button>
      {topics.map(topic => {
        const isSelected = selectedTopic?.toLowerCase() === topic.toLowerCase();
        return (
          <button
            key={topic}
            type="button"
            onClick={() => onSelectTopic && onSelectTopic(topic)}
            className={`px-4 py-2 border-2 rounded-xl text-sm font-bold transition-all transform hover:scale-105 active:scale-95 ${
              isSelected
                ? "bg-v-blue-primary border-v-blue-primary text-white shadow-md shadow-blue-500/20"
                : "bg-v-bg-card border-v-border-color text-v-text-main hover:border-v-blue-primary hover:text-v-blue-primary"
            }`}
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
};

export default TopicBar;
