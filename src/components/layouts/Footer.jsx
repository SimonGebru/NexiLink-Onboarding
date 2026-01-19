export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="px-4 py-4 sm:px-6">
        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} Nexilink Onboarding. All rights reserved.
        </div>
      </div>
    </footer>
  );
}