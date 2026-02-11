const RecentActivity = ({ attempts }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="text-lg font-semibold mb-4">
        Recent Activity
      </h3>

      {attempts.length === 0 ? (
        <p className="text-gray-500">No attempts yet</p>
      ) : (
        <div className="space-y-3">
          {attempts.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">
                  Score: {item.score}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm">{item.status}</p>
                <p className="text-xs text-gray-400">
                  {item.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
