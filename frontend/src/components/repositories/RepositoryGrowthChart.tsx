import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
 YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", value: 1 },
  { month: "Feb", value: 2 },
  { month: "Mar", value: 4 },
  { month: "Apr", value: 6 },
  { month: "May", value: 8 },
  { month: "Jun", value: 10 },
];

export default function RepositoryGrowthChart() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Repository Growth
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}