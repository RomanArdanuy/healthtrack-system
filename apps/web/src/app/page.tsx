import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">HealthTrack System</h1>
      <p className="text-xl mb-8">
        Gestión hospitalaria y monitorización remota de pacientes
      </p>
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md"
        >
          Iniciar sesión
        </Link>
        <Link 
          href="/dashboard" 
          className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-3 rounded-md"
        >
          Ver demo
        </Link>
      </div>
    </main>
  );
}