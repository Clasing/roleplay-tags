import Image from "next/image";

interface RoleplayCardProps {
  roleplay: {
    _id: string;
    name: string;
    description: string;
    image: string;
  };
  onViewDetails?: (id: string) => void;
}

export default function RoleplayCard({ roleplay, onViewDetails }: RoleplayCardProps) {
  return (
    <div className="group relative flex h-[420px] flex-col items-center overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:from-zinc-900 dark:to-black dark:shadow-[0_1px_3px_rgba(255,255,255,0.02)] dark:hover:border-zinc-700 dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.06)]">
      
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50 dark:via-gray-600" />
      
      <div className="relative mb-6">
        
        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100 dark:from-gray-800 dark:to-gray-700" />
        
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-[3px] border-white shadow-lg transition-all duration-300 group-hover:border-gray-100 group-hover:shadow-xl dark:border-zinc-800 dark:group-hover:border-zinc-700">
          <Image
            src={roleplay.image}
            alt={roleplay.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-black dark:border-black dark:bg-white" />
      </div>

      <h3 className="mb-3 text-center text-xl font-semibold tracking-tight text-black transition-colors group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-300">
        {roleplay.name}
      </h3>

      <div className="mb-4 h-px w-12 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />

      <p className="mb-6 flex-1 line-clamp-3 text-center text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {roleplay.description}
      </p>

      <button 
        onClick={() => onViewDetails?.(roleplay._id)}
        className="group/btn relative mt-auto w-full overflow-hidden rounded-lg border border-gray-900 bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-gray-900 dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Ver detalles
          <svg 
            className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
      </button>
    </div>
  );
}
