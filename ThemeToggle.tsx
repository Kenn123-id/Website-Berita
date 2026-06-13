import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  id?: string;
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export default function ThemeToggle({ id = 'theme-toggle', theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      id={id}
      onClick={onToggle}
      type="button"
      className="p-2 mr-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors duration-200 cursor-pointer"
      title={theme === 'light' ? 'Ganti ke Tema Gelap' : 'Ganti ke Tema Terang'}
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" id="icon-moon" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400" id="icon-sun" />
      )}
    </button>
  );
}

