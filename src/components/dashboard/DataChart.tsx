
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DataChartProps {
  data: any[];
  dataKeys: string[];
  colors: string[];
  yAxisLabel: string;
}

export function DataChart({ data, dataKeys, colors, yAxisLabel }: DataChartProps) {
  const chartData = data.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    ...dataKeys.reduce((acc, key) => ({
      ...acc,
      [key]: Number(item[key]?.toFixed(1))
    }), {})
  }));

  const getKeyLabel = (key: string) => {
    const labels: Record<string, string> = {
      temperature: "Temperatura (°C)",
      airHumidity: "Umidade do Ar (%)",
      soilHumidity: "Umidade do Solo (%)",
      illuminance: "Iluminância (lux)",
      photoperiod: "Fotoperíodo (h)"
    };
    return labels[key] || key;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backdropFilter: 'blur(4px)'
            }}
            labelStyle={{ color: '#374151' }}
          />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index]}
              strokeWidth={2}
              dot={{ fill: colors[index], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[index], strokeWidth: 2 }}
              name={getKeyLabel(key)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
