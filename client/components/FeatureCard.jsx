export default function FeatureCard({
  icon: Icon,
  title,
  text,
  bgColor,
  borderColor,
}) {
  return (
    <div
      className={`group bg-gray-900 rounded-2xl p-8 shadow-lg border ${borderColor} hover:shadow-2xl hover:${borderColor} transition-all duration-300 transform hover:-translate-y-2`}
    >
      <div
        className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{text}</p>
    </div>
  );
}
