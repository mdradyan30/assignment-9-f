'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-base-300 bg-base-100">
      <div className="vault-container py-16">
        {/* Top masthead row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-base-300">
          <div>
            <p className="eyebrow text-base-content/50 mb-3">
              Volume One · Est. 2026
            </p>
            <Link
              href="/"
              className="font-display text-5xl md:text-6xl tracking-tightest leading-none"
            >
              Idea<span className="italic text-secondary">Vault</span>
            </Link>
          </div>
          <p className="body-prose max-w-sm">
            A reading room for early-stage thinking. We publish what
            founders are working on, before they know what it is.
          </p>
        </div>

        {/* Three columns */}
        <div className="grid gap-10 md:grid-cols-3 py-12">
          <FooterCol num="01" title="Read">
            <FooterLink href="/ideas">Browse all ideas</FooterLink>
            <FooterLink href="/ideas?sort=trending">Trending this week</FooterLink>
            <FooterLink href="/ideas">Categories</FooterLink>
          </FooterCol>

          <FooterCol num="02" title="Contribute">
            <FooterLink href="/add-idea">Submit an idea</FooterLink>
            <FooterLink href="/my-ideas">Your archive</FooterLink>
            <FooterLink href="/my-interactions">Activity log</FooterLink>
          </FooterCol>

          <FooterCol num="03" title="Correspond">
            <li className="text-sm text-base-content/70 font-mono">
              hello@ideavault.dev
            </li>
            <li className="text-sm text-base-content/70">
              Dhaka, Bangladesh
            </li>
            <li className="flex gap-3 pt-2">
              <Social label="X" href="https://x.com">
                <FaXTwitter size={14} />
              </Social>
              <Social label="GitHub" href="https://github.com">
                <FaGithub size={14} />
              </Social>
              <Social label="LinkedIn" href="https://linkedin.com">
                <FaLinkedinIn size={14} />
              </Social>
            </li>
          </FooterCol>
        </div>

        {/* Colophon */}
        <div className="pt-6 border-t border-base-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-base-content/50 font-mono">
          <p>© {year} IdeaVault — All thinking reserved.</p>
          <p>Set in Fraunces &amp; Inter.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ num, title, children }) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-5">
        <span className="num-badge">{num}</span>
        <h4 className="font-display text-lg">{title}</h4>
      </div>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="text-base-content/70 hover:text-base-content hover:underline underline-offset-4 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function Social({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid place-items-center h-9 w-9 border border-base-300 hover:bg-base-content hover:text-base-100 hover:border-base-content transition-colors"
    >
      {children}
    </a>
  );
}
