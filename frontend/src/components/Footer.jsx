import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/10 dark:border-zinc-800/10 bg-white/50 dark:bg-brand-darkBg/50 py-12 px-6 md:px-12 text-zinc-400 dark:text-zinc-500 text-xs font-mono mt-12 w-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          © {currentYear} AURA DESIGN LAB. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center space-x-6">
          <a href="https://twitter.com" className="hover:text-zinc-900 dark:hover:text-white bento-transition">TWITTER</a>
          <a href="https://linkedin.com" className="hover:text-zinc-900 dark:hover:text-white bento-transition">LINKEDIN</a>
          <a href="https://read.cv" className="hover:text-zinc-900 dark:hover:text-white bento-transition">READ.CV</a>
        </div>
      </div>
    </footer>
  );
}
