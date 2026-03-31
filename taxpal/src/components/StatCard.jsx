export default function StatCard({ title, value, color }) {
  const colorMap = {
    green: "text-green-500",
    red: "text-red-500",
    blue: "text-blue-500",
    yellow: "text-yellow-500"
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/30 hover:scale-105 transition-all duration-300">
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>
        {value}
      </p>
    </div>
  );
}
