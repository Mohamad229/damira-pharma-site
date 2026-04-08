import { AuthProvider } from '@/components/providers/auth-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex">
        <aside className="w-64 border-r">
          {/* Sidebar placeholder - detailed admin shell comes in Milestone 3 */}
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  );
}
