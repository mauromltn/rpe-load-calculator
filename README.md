# RPE Load Calculator

Translate training effort into numbers you can load on the bar. A fast, focused calculator for RPE-based strength training — estimate your 1RM, find target weights for a given effort, and work out percentage-based loads for training and competition attempts.

🔗 **Live app:** [rpe-load-calculator.vercel.app](https://rpe-load-calculator.vercel.app)

## What it does

- **Have → Est. 1RM** — enter a weight, reps, and RPE from a set you've done to estimate your one-rep max.
- **Want → Target Weight** — enter the reps and RPE you're aiming for and get the weight to load.
- **Percent of a Training Max** — set a training max (or reuse your estimated 1RM), pick a percentage, and get the set weight rounded to the nearest 2.5 kg. Includes opener / 2nd / 3rd attempt presets.
- **% of 1RM Reference** — a full RPE × reps lookup table (a continuous translation of Tuchscherer's chart) so you can read off percentages at a glance.

## Background

RPE and RIR are two common ways lifters gauge intensity:

- **RPE (Rate of Perceived Exertion)** — a 1–10 scale of how hard a set felt. An RPE of 10 means no reps left in the tank; RPE 8 means roughly two more were possible.
- **RIR (Reps in Reserve)** — how many reps you could still have done. RIR 2 ≈ RPE 8.

Both map to a percentage of your one-rep max for a given rep count. This tool lets you move between effort (RPE/RIR), estimated max, and loaded weight so you can program precisely without maxing out every session.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- Deployed on [Vercel](https://vercel.com/)

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)

### Install & run

\`\`\`bash
git clone https://github.com/mauromltn/rpe-load-calculator.git
cd rpe-load-calculator
pnpm install
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Project structure

\`\`\`
app/          # Next.js routes, layout, and pages
components/    # UI components (incl. the calculator and reference table)
lib/           # Calculation logic and helpers
public/        # Static assets and fonts
\`\`\`

## Contributing

Contributions are welcome! If you spot a bug or have an idea, feel free to:

- [Open an issue](https://github.com/mauromltn/rpe-load-calculator/issues)
- Submit a pull request

## Usage & license

This project is **source-available, not open source.** The code is public so you can report issues and contribute improvements, but it is **not licensed for reuse, redistribution, or deployment of your own copy.** All rights reserved © mauromltn.

If you'd like to use the calculator, please use the [hosted app](https://rpe-load-calculator.vercel.app).

## Credits

The RPE math is based on Mike Tuchscherer's RPE chart (Reactive Training Systems). The implementation, design, RIR support, percentage/training-max tool, and reference table are my own work.

---

Built by [@mauromltn](https://github.com/mauromltn).
