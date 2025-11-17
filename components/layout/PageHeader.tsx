import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  logoUrl?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, logoUrl, children }: PageHeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {logoUrl && (
              <div className="relative h-12 w-12 flex-shrink-0 lg:h-14 lg:w-14">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white lg:text-5xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {children && (
            <div className="flex-shrink-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
