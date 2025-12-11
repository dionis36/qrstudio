import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">QR Studio</h1>
            <div className="flex gap-4">
                <Link href="/create" className="px-4 py-2 bg-black text-white rounded">Create QR</Link>
                <Link href="/my-qrs" className="px-4 py-2 border border-black rounded">My QRs</Link>
            </div>
        </main>
    );
}
