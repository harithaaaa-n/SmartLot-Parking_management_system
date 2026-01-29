import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';



const SlotUsagePieChart = ({ data }: { data: any[] }) => {
  // Use passed data or empty array
  const displayData = data && data.length > 0 ? data : [
    { name: 'Available', value: 100, color: '#e5e7eb' } // Fallback if empty (e.g. all empty)
  ];

  return (
    <Card className="shadow-md border border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-1 h-6 bg-accent rounded-full"></span>
          Today's Slot Usage Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} slots`, name]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SlotUsagePieChart;