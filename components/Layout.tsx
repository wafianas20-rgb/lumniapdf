import React from 'react';
import { APP_NAME, TOOLS } from '../constants';
import { FileHeart, Menu, X, ChevronRight, ShieldCheck, Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPath = '/' }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // Normalize path to ensure it starts with / for comparison
  const normalizedPath = currentPath.startsWith('/') ? currentPath : '/' + currentPath;

  const isActive = (path: string) => normalizedPath === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FC]">
      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 h-20 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <a href="#/" className="flex-shrink-0 flex items-center gap-2.5 group" onClick={() => setIsMenuOpen(false)}>
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
                  <FileHeart size={22} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-2xl tracking-tight text-slate-900">
                  {APP_NAME}
                </span>
              </a>
              
              <nav className="hidden md:flex items-center space-x-1">
                {TOOLS.slice(0, 4).map((tool) => (
                  <a
                    key={tool.id}
                    href={`#${tool.path}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(tool.path)
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tool.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <a href="#/ai-summarize" className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                 <span>Try AI Tools</span>
                 <span className="bg-brand-100 text-brand-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">New</span>
              </a>
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl md:hidden animate-in slide-in-from-top-5 duration-200">
            <div className="py-4 px-4 space-y-2">
              {TOOLS.map((tool) => (
                <a
                  key={tool.id}
                  href={`#${tool.path}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-base font-medium ${
                    isActive(tool.path)
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <tool.icon size={20} className={isActive(tool.path) ? 'text-brand-600' : 'text-slate-400'} />
                    {tool.title}
                  </span>
                  <ChevronRight size={16} className="opacity-30" />
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                            <FileHeart size={18} />
                        </div>
                        <span className="font-bold text-xl text-slate-900">{APP_NAME}</span>
                     </div>
                     <p className="text-slate-500 text-sm leading-relaxed">
                        Your all-in-one solution for PDF manipulation. Secure, fast, and running entirely in your browser.
                     </p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Tools</h4>
                    <ul className="space-y-2 text-sm text-slate-500">
                        {TOOLS.map(t => (
                            <li key={t.id}><a href={`#${t.path}`} className="hover:text-brand-600 transition-colors">{t.title}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Security & Trust</h4>
                    <ul className="space-y-3 text-sm text-slate-500">
                        <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> ISO 27001 Certified</li>
                        <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> GDPR Compliant</li>
                        <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> TLS Encryption</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-100 pt-8 text-center">
                <p className="text-slate-400 text-sm flex items-center justify-center gap-1">
                    &copy; {new Date().getFullYear()} {APP_NAME} Inc. Made with <Heart size={14} className="text-brand-500 fill-brand-500" /> for productivity.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
};