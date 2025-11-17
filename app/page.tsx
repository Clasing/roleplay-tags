import PageHeader from '@/components/layout/PageHeader';
import RoleplayList from '@/components/roleplay/RoleplayList';

interface Roleplay {
  _id: string;
  name: string;
  description: string;
  image: string;
}

async function getRoleplays(): Promise<Roleplay[]> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090';

    const res = await fetch(`${apiBaseUrl}/api/v2/clasing-ai/roleplay-agents/all`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Error al obtener roleplays');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching roleplays:', error);
    return [];
  }
}

export default async function Home() {
  const roleplays = await getRoleplays();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <PageHeader
        title="Clashing Roleplays App"
        subtitle="Genera y administra tus roleplays con inteligencia artificial"
        logoUrl="https://clasing-public.s3.eu-central-1.amazonaws.com/logos/clasing-new-iso-color.svg"
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <RoleplayList roleplays={roleplays} />
      </main>
    </div>
  );
}
