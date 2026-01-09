import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ComposedChart,
} from "recharts";
import CustomTooltip from "../../components/CustomToolTip";

interface SarimaDataPoint {
  month: string;
  forecast: number;
}

export interface TrendDataPoint {
  year: number;
  tavg: number;
}

const PrecipitationDashboard = () => {
  const [sarimaData, setSarimaData] = useState<SarimaDataPoint[]>([]);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [regressionLine, setRegressionLine] = useState<TrendDataPoint[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/forecast/sarima?steps=12")
      .then((res) => {
        const data: SarimaDataPoint[] = res.data.forecast.map(
          (value: number, index: number) => ({
            month: `M${index + 1}`,
            forecast: value,
          })
        );
        setSarimaData(data);
      });

    axios
      .get("http://localhost:5000/api/forecast/global-warming-trend")
      .then((res) => {
        const { years, temperatures } = res.data.data;
        const data: TrendDataPoint[] = years.map(
          (year: number, idx: number) => ({
            year,
            tavg: temperatures[idx],
          })
        );

        const n = data.length;
        const sumX = data.reduce((sum, d) => sum + d.year, 0);
        const sumY = data.reduce((sum, d) => sum + d.tavg, 0);
        const sumXY = data.reduce((sum, d) => sum + d.year * d.tavg, 0);
        const sumX2 = data.reduce((sum, d) => sum + d.year * d.year, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        const regression: TrendDataPoint[] = data.map((d) => ({
          year: d.year,
          tavg: slope * d.year + intercept,
        }));

        setTrendData(data);
        setRegressionLine(regression);
      });
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        SARIMA Forecast (Next 12 Months)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sarimaData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Global Warming Trend (Avg Temp by Year)
        </h2>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Global Warming Trend (1990-2022)
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(tick) => tick.toString()}
              />
              <YAxis
                domain={[25, 28]}
                label={{
                  value: "Temperature (°C)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter
                name="Historical Temperatures"
                data={trendData}
                fill="#8884d8"
                dataKey="tavg"
              />
              <Line
                name="Trend Line"
                data={regressionLine}
                type="linear"
                dataKey="tavg"
                stroke="#ff7300"
                dot={false}
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PrecipitationDashboard;
