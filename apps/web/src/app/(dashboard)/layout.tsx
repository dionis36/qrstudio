import { Navbar } from '@/components/Navbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-100">
            <Navbar />
            <main className="flex-1 flex flex-col pt-24">
                {children}
            </main>
        </div>
    );
}
