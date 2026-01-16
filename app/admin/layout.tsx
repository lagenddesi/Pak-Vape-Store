export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="p-4 bg-slate-800 border-b border-purple-500/30 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-purple-400">PAK VAPE ADMIN</h1>
        <div className="flex gap-4 text-xs md:text-sm font-mono">
          <a href="/admin" className="hover:text-purple-400">Inventory</a>
          <a href="/admin/orders" className="hover:text-purple-400">Orders</a>
          <a href="/admin/settings" className="hover:text-purple-400">Settings</a>
          <a href="/admin/about" className="hover:text-purple-400">Manage About</a>
        </div>
      </nav>
      <main className="p-4 md:p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
