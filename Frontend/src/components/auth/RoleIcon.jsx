import { cn } from "../../utils/cn";

const SIZES = {
  sm: { box: "h-6 w-6 rounded-koru-pill", icon: 14 },
  md: { box: "h-10 w-10 rounded-koru-md", icon: 20 },
  lg: { box: "h-12 w-12 rounded-koru-lg", icon: 24 },
};

// Role icon on its Material 3 tonal container.
export default function RoleIcon({ role, size = "md", className }) {
  const Icon = role.icon;
  const s = SIZES[size] ?? SIZES.md;
  return (
    <span
      aria-hidden="true"
      className={cn("flex shrink-0 items-center justify-center", s.box, role.container, className)}
    >
      <Icon size={s.icon} strokeWidth={1.75} />
    </span>
  );
}
