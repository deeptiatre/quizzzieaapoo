import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PerformanceGraph = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-5">
        <p className="text-gray-500">
          No graph data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="text-lg font-semibold mb-4">
        Performance Trend
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="label" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceGraph;
