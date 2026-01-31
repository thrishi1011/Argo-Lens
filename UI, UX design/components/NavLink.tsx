import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

import { motion } from "framer-motion";

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, onMouseEnter, ...props }, ref) => {
    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onMouseEnter?.(e);
    };

    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName, "inline-block")
        }
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        <motion.span
          className="inline-block w-full h-full"
          whileHover={{ y: -5 }}
        >
          {typeof props.children === 'function' ? (props.children as any)({ isActive: false, isPending: false }) : props.children}
        </motion.span>
      </RouterNavLink>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
