import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Badge, Card, CardDescription, CardTitle } from "../components/UI";
import AuthLayout, { AuthHeading } from "../components/auth/AuthLayout";
import RoleIcon from "../components/auth/RoleIcon";
import { AUTH_ROLE_LIST } from "../components/auth/authRoles";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.2, 0, 0, 1] } },
};

// Onboarding page – introduces the platform and routes users by role
export default function Onboarding() {
  return (
    <AuthLayout>
      <AuthHeading
        eyebrow={<Badge variant="primary" size="md">Welcome to Koru</Badge>}
        title="Who's signing in?"
        subtitle="Choose your role and we'll take you to the right place."
      />

      <Motion.ul
        variants={listVariants}
        initial="hidden"
        animate="show"
        aria-label="Choose your role"
        className="flex flex-col gap-3"
      >
        {AUTH_ROLE_LIST.map((role) => (
          <Motion.li key={role.key} variants={itemVariants}>
            <Card
              as={Link}
              to={role.route}
              variant="interactive"
              tone="surface"
              padding="sm"
              radius="xl"
              className="group flex items-center gap-4 shadow-koru-xs ring-1 ring-inset ring-koru-outline-variant/60 hover:ring-koru-outline-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-koru-focus"
            >
              <RoleIcon role={role} size="lg" />
              <div className="min-w-0 flex-1">
                <CardTitle>{role.label}</CardTitle>
                <CardDescription className="!mt-0.5">{role.description}</CardDescription>
              </div>
              <ChevronRight
                size={20}
                aria-hidden="true"
                className="shrink-0 text-koru-on-surface-variant transition-transform duration-150 ease-koru-out group-hover:translate-x-0.5 group-hover:text-koru-primary"
              />
            </Card>
          </Motion.li>
        ))}
      </Motion.ul>

      <p className="mt-8 text-koru-label font-normal text-koru-on-surface-variant">
        New to Koru?{" "}
        <Link to="/signup" className="font-medium text-koru-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
