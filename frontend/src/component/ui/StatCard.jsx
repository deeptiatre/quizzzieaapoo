import VCard from "./VCard";

const StatCard = ({ title, value, color, icon }) => {
  return (
    <VCard className={`text-center flex flex-col items-center justify-center p-6 ${color || 'bg-v-bg-card'}`}>
      {icon && <div className="mb-2 text-v-text-muted">{icon}</div>}
      <p className="text-sm text-v-text-muted font-bold uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-extrabold text-white mt-1">{value}</p>
    </VCard>
  );
};

export default StatCard;
