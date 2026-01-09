import { TrendDataPoint } from "../pages/user/PrecipitationDashboard";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TrendDataPoint }>;
  label?: string | number;
}
const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length > 0) {
    const { year, tavg } = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow-md border border-gray-300">
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold">Year:</span> {year}
        </p>
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold">Avg Temperature:</span>{" "}
          {tavg.toFixed(2)} °C
        </p>
      </div>
    );
  }
  return null;
};
export default CustomTooltip;
