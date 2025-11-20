'use client';

interface LevelFilterProps {
  selectedLevel: string;
  onLevelChange: (level: string) => void;
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function LevelFilter({ selectedLevel, onLevelChange }: LevelFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Nivel:
      </label>
      <select
        value={selectedLevel}
        onChange={(e) => onLevelChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 dark:focus:border-pink-400 dark:focus:ring-pink-400"
      >
        <option value="">Todos los niveles</option>
        {LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
}
