import VCard from "./VCard";

const ScoreGraph = ({ data }) => {
  return (
    <VCard>
      <h3 className="text-xl font-bold text-white mb-6">Score Progress</h3>

      {!data || data.length === 0 ? (
        <p className="text-v-text-muted italic">No attempts yet. Take a quiz to see your progress!</p>
      ) : (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm font-bold text-v-text-muted mb-1">
                <span>{item.label}</span>
                <span className="text-white">{item.score}%</span>
              </div>
              <div className="w-full bg-v-bg-main h-4 rounded-full overflow-hidden border-2 border-v-border-color">
                <div
                  className="bg-v-green-primary h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </VCard>
  );
};

export default ScoreGraph;
