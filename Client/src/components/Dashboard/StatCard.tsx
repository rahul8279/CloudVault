type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
};

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
      {description && (
        <p className="mt-2 text-xs text-gray-500">{description}</p>
      )}
    </article>
  );
}

export default StatCard;
