# Vignesh: Portfolio and Learn Dump

A living record of what I build, learn, debug, and improve as I grow toward AI and backend engineering roles.

This portfolio is intentionally evidence-first. Completed work, active builds, learning notes, and planned projects are labelled separately so the site reflects real progress rather than unverified claims.

## Currently building

### AI-powered résumé parser

My first end-to-end AI and backend project. The initial scope is intentionally small:

- Upload and validate a résumé
- Extract readable text
- Return structured candidate information
- Build the API with FastAPI and Pydantic
- Add storage, authentication, and deployment incrementally

Current status: **planning the first implementation**.

## Portfolio features

- Documentation-inspired navigation
- Search with `Cmd/Ctrl + K`
- Dark and light themes
- Theme-aware text selection
- Daily engineering journal
- Currently-building status
- Project case-study structure
- Responsive mobile layout

## Daily journal

Journal entries record four things:

- **Built:** the concrete work completed
- **Learned:** a technical insight worth retaining
- **Solved:** a problem, bug, or decision
- **Next:** the next verifiable step

Entries live in [`src/data/journal.json`](src/data/journal.json). Each update can be committed to GitHub and automatically deployed once hosting is connected.

## Tech stack

- [Astro](https://astro.build/)
- TypeScript
- HTML and CSS
- Client-side JavaScript for search and theme controls

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build

```bash
npm run build
```

The production site is generated in `dist/`.

## Update and sync

```bash
git add .
git commit -m "Describe the update"
git push
```

The planned publishing flow is:

```text
Daily update → GitHub commit → automatic build → live portfolio
```

## Project status labels

- **Completed:** built and available as evidence
- **Building:** active implementation is underway
- **Learning:** currently studying or practising
- **Planned:** discussed or intended, but not started

## Repository

[github.com/brutev/portfolio](https://github.com/brutev/portfolio)
