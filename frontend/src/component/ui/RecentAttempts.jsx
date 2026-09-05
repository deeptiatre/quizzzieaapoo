import VCard from "./VCard";

const RecentAttempts = ({ attempts }) => {
  return (
    <VCard>
      <h3 className="text-xl font-bold text-white mb-6">Recent Attempts</h3>

      {!attempts || attempts.length === 0 ? (
        <p className="text-v-text-muted italic">No recent attempts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b-2 border-v-border-color text-v-text-muted uppercase text-xs tracking-wider">
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Time/Reason</th>
                <th className="px-4 py-3 text-center">Tab Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-v-border-color">
              {attempts.map((a, idx) => (
                <tr key={idx} className="hover:bg-v-bg-card-hover transition-colors">
                  <td className="px-4 py-4 font-bold text-white text-lg">{a.score}</td>
                  <td className="px-4 py-4 text-v-text-muted text-sm">
                    {new Date(a.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase tracking-wide border-b-2
                      ${a.status === 'Submitted' ? 'bg-v-green-primary text-v-bg-main border-v-green-shadow' : 'bg-v-yellow-warning text-v-bg-main border-v-yellow-shadow'}
                    `}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-v-text-muted text-sm">{a.reason || '-'}</td>
                  <td className="px-4 py-4 text-center font-bold text-v-yellow-warning">{a.tabSwitchCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </VCard>
  );
};

export default RecentAttempts;
