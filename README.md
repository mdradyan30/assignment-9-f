# IdeaVault — Client

**Website:** IdeaVault
**Live URL:** _https://ideavault.vercel.app_ (placeholder — replace with your deployment URL)

> A quiet reading room for loud startup ideas. Share an early-stage concept,
> discover what others are working on, and refine your thinking together
> through long-form discussion. Designed as an editorial publication, built
> as a modern web app.

## ✦ Features

- **Editorial reading experience** — A clean, magazine-inspired interface
  built with Fraunces (serif display) and Inter (body), keyed to a
  cream/ink palette with a single rust accent. Light and dark themes are
  both supported.
- **Submit, browse, edit, delete ideas** — Authenticated users can file a
  new idea, browse the archive with live search, category, and date-range
  filters, and fully manage their own submissions from a dedicated _My
  Ideas_ table.
- **Threaded discussions** — Each idea has its own comment section.
  Authors can edit or delete their own comments at any time, and the
  _My Activity_ page collects every reply you've left across the platform
  in one place.
- **Secure JWT authentication with two methods** — Sign up with email and
  password (with a live password-strength checklist) or with Google OAuth.
  Tokens are persisted client-side, validated for expiry on every load,
  and required for all write actions.
- **Trending, likes, and bookmarks** — Ideas are ranked by an engagement
  score combining likes and recency. Readers can like and bookmark ideas
  with optimistic UI updates, and revisit anything in their saved list.
- **Custom 404 with Lottie animation** — A drifting-page Lottie animation
  on the not-found route, matching the editorial style.
- **Fully responsive** — Designed mobile-first, with thoughtful breakpoints
  for tablet and desktop.
- **Dynamic page titles & toast notifications** — Each route updates the
  browser title; all user feedback is delivered through `react-hot-toast`,
  never browser `alert()`.

## ✦ Tech Stack

| Layer       | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 14 (App Router, JSX)                        |
| Styling     | Tailwind CSS + DaisyUI (custom editorial themes)    |
| State       | React Context (Auth, Theme)                         |
| Auth        | Better Auth with Google OAuth and Email/Password   |
| Animations  | `lottie-react`, custom Tailwind keyframes           |
| Toasts      | `react-hot-toast`                                   |
| Icons       | `react-icons`                                       |

## ✦ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# edit .env.local with your API URL and Google Client ID

# 3. Run the dev server
npm run dev
```

Visit http://localhost:3000.

### Environment Variables

| Key                              | Description                                |
| -------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_API_URL`            | Base URL of the IdeaVault API (`/api`)     |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`   | OAuth client ID from Google Cloud Console  |

## ✦ Pages & Routes

| Route                  | Access  | Purpose                                |
| ---------------------- | ------- | -------------------------------------- |
| `/`                    | Public  | Home — banner, trending, how it works  |
| `/ideas`               | Public  | Searchable, filterable archive of ideas|
| `/ideas/[id]`          | Private | Idea details + comments                |
| `/add-idea`            | Private | Submit a new idea                      |
| `/my-ideas`            | Private | Edit/delete your own ideas             |
| `/my-interactions`     | Private | Your comments grouped by idea          |
| `/profile`             | Private | Manage your account profile            |
| `/login`, `/register`  | Public  | Authentication entry points            |
| `*` (not-found)        | Public  | Editorial 404 with Lottie animation    |

## ✦ Scripts

| Command         | What it does                |
| --------------- | --------------------------- |
| `npm run dev`   | Start the dev server (3000) |
| `npm run build` | Production build            |
| `npm start`     | Run production build        |
| `npm run lint`  | Lint with ESLint            |
