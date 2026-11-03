import { motion as Motion, MotionConfig } from "framer-motion";
import { BookOpen, CalendarDays, ChartLine } from "lucide-react";
import KoruLogo from "../UI/KoruLogo";
import { cn } from "../../utils/cn";

const HIGHLIGHTS = [
  { icon: BookOpen, label: "Courses, modules and assignments" },
  { icon: CalendarDays, label: "Timetables and attendance" },
  { icon: ChartLine, label: "Grades, feedback and progress" },
];

// Shared layout for onboarding, login and sign-up.
// Desktop: primary brand panel beside the content on the auth canvas.
// Mobile: the panel collapses and the wordmark sits above the content.
export default function AuthLayout({
  children,
  panelTitle = "Learning that grows with you.",
  panelBody = "Koru brings courses, classes and progress together for students, teachers and administrators.",
  contentClassName,
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div
        data-tts-root="true"
        className="koru-auth-canvas flex min-h-screen gap-3 p-3"
      >
        <aside className="sticky top-3 hidden h-[calc(100vh-1.5rem)] w-[42%] max-w-[600px] shrink-0 flex-col justify-between overflow-hidden rounded-koru-3xl bg-koru-primary p-10 text-koru-on-primary lg:flex xl:p-12">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-koru-lg bg-koru-surface-container-lowest p-1.5 shadow-koru-sm">
              <KoruLogo />
            </span>
            <span className="font-display text-2xl font-medium">Koru</span>
          </div>

          <Motion.div
            key={panelTitle}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
          >
            <h2 className="max-w-md font-display text-[2.75rem] leading-[1.08] font-medium tracking-[-0.02em] text-koru-on-primary">
              {panelTitle}
            </h2>
            <p className="mt-4 max-w-sm text-koru-body text-koru-on-primary/75">{panelBody}</p>

            <ul className="mt-10 flex flex-col gap-3">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label} className="flex items-center gap-3 text-koru-label text-koru-on-primary/90">
                    <span className="flex h-9 w-9 items-center justify-center rounded-koru-md bg-koru-on-primary/10">
                      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </Motion.div>

          <p className="text-koru-caption text-koru-on-primary/60">
            Protected by Koru · POPIA-compliant by design
          </p>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col items-center justify-center px-2 py-8 sm:px-8">
          <div className="mb-10 h-10 self-start sm:self-center lg:hidden">
            <KoruLogo showText className="h-full w-auto" />
          </div>

          <Motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
            className={cn("w-full max-w-[440px]", contentClassName)}
          >
            {children}
          </Motion.div>

          <p className="mt-10 text-center text-koru-caption text-koru-on-surface-variant lg:hidden">
            Protected by Koru · POPIA-compliant by design
          </p>
        </main>
      </div>
    </MotionConfig>
  );
}

// Heading block for auth screens: optional eyebrow row, display title, subtitle.
export function AuthHeading({ eyebrow, title, subtitle }) {
  return (
    <header className="mb-8">
      {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}
      <h1 className="font-display text-koru-display text-koru-on-surface">{title}</h1>
      {subtitle ? (
        <p className="mt-2 text-koru-body text-koru-on-surface-variant">{subtitle}</p>
      ) : null}
    </header>
  );
}

// "or" divider between password and Google sign-in.
export function AuthDivider({ label = "or" }) {
  return (
    <div className="flex items-center gap-3 text-koru-caption text-koru-on-surface-variant">
      <span className="h-px flex-1 bg-koru-outline-variant" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-koru-outline-variant" />
    </div>
  );
}
