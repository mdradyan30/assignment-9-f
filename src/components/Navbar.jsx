'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiPlusCircle,
  FiUser,
  FiLogOut,
  FiGrid,
  FiActivity,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/ideas', label: 'Ideas' },
];

const privateLinks = [
  { href: '/add-idea', label: 'Submit' },
  { href: '/my-ideas', label: 'My Ideas' },
  { href: '/my-interactions', label: 'Activity' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Signed out.');
    router.push('/');
  };

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const allLinks = user ? [...publicLinks, ...privateLinks] : publicLinks;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-base-100/90 backdrop-blur-md border-b border-base-300'
          : 'bg-base-100 border-b border-transparent'
      }`}
    >
      <nav className="vault-container flex items-center justify-between h-[72px]">
        {/* Wordmark */}
        <Link href="/" className="flex items-baseline gap-2 group shrink-0">
          <span className="font-display text-[1.625rem] leading-none font-medium tracking-tightest">
            Idea<span className="italic text-secondary">Vault</span>
          </span>
          <span className="eyebrow hidden sm:inline text-base-content/40">
            № 01
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm transition-colors ${
                isActive(link.href)
                  ? 'text-base-content'
                  : 'text-base-content/55 hover:text-base-content'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute left-0 right-0 -bottom-1.5 h-px bg-base-content" />
              )}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid place-items-center h-9 w-9 rounded-sm hover:bg-base-200 transition-colors"
            >
              {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
          )}

          {user ? (
            <div className="dropdown dropdown-end hidden lg:block">
              <button
                tabIndex={0}
                className="flex items-center gap-2.5 group"
                aria-label="Account menu"
              >
                <Avatar user={user} />
                <span className="text-sm max-w-[120px] truncate text-base-content/70 group-hover:text-base-content">
                  {user.name}
                </span>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content mt-3 w-64 border border-base-300 bg-base-100 shadow-lg p-0 z-[60]"
              >
                <li className="px-4 py-3 border-b border-base-300">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-base-content/55 truncate font-mono mt-0.5">
                    {user.email}
                  </p>
                </li>
                <MenuItem href="/profile" icon={<FiUser size={14} />}>
                  Profile
                </MenuItem>
                <MenuItem href="/add-idea" icon={<FiPlusCircle size={14} />}>
                  Submit Idea
                </MenuItem>
                <MenuItem href="/my-ideas" icon={<FiGrid size={14} />}>
                  My Ideas
                </MenuItem>
                <MenuItem
                  href="/my-interactions"
                  icon={<FiActivity size={14} />}
                >
                  Activity
                </MenuItem>
                <li className="border-t border-base-300">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-base-200 transition-colors text-left"
                  >
                    <FiLogOut size={14} /> Sign out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden lg:inline-flex btn-editorial-solid"
            >
              Sign in
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
            className="lg:hidden grid place-items-center h-9 w-9 rounded-sm hover:bg-base-200"
          >
            {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-base-300 bg-base-100 animate-fade-in">
          <div className="vault-container py-5 flex flex-col">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 text-base ${
                  isActive(link.href)
                    ? 'text-base-content border-b border-base-content'
                    : 'text-base-content/65 border-b border-base-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="flex items-center gap-3 py-4 border-b border-base-300">
                  <Avatar user={user} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-base-content/55 truncate font-mono">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link href="/profile" className="py-3 text-sm border-b border-base-300">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-3 text-sm text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="mt-4 btn-editorial-solid justify-center">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MenuItem({ href, icon, children }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"
      >
        {icon}
        {children}
      </Link>
    </li>
  );
}

function Avatar({ user }) {
  if (user.photoURL) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.photoURL}
        alt={user.name}
        className="h-7 w-7 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="grid place-items-center h-7 w-7 rounded-full bg-base-content text-base-100 text-xs font-medium">
      {user.name?.charAt(0)?.toUpperCase() || 'U'}
    </span>
  );
}
