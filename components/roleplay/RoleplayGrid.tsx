import RoleplayCard from './RoleplayCard';

interface Roleplay {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  image: string;
}

interface RoleplayGridProps {
  roleplays: Roleplay[];
  onViewDetails?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function RoleplayGrid({ roleplays, onViewDetails, onDelete }: RoleplayGridProps) {
  if (roleplays.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            No se encontraron roleplays
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {roleplays.map((roleplay) => (
        <RoleplayCard
          key={roleplay._id || roleplay.id || roleplay.name}
          roleplay={roleplay}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
