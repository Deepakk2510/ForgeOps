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
  { month: "Jan", stars: 1 },
  { month: "Feb", stars: 2 },
  { month: "Mar", stars: 4 },
  { month: "Apr", stars: 6 },
  { month: "May", stars: 8 },
  { month: "Jun", stars: 10 },
];

export default function RepositoryGrowthChart() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Repository Growth
          </h2>

          <p className="text-sm text-muted-foreground">
            Repository popularity over the last 6 months
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.3}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="stars"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}