import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-white">
      <aside className="w-64 border-r border-gray-200 flex-shrink-0">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8">
          <Header />
        </header>

        <main className="flex-1 overflow-y-auto p-8">{children} <Footer /> </main>
      </div>
    </div>
  );
}
