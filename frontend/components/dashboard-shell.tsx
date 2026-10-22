"use client";

/**
 * One persistent shell for every signed-in area (admin, teacher, family) —
 * collapsible sidebar, top command bar, mobile
 * drawer and an account footer. The role-specific bits come in as props.
 */
import { Globe, LogOut, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoLockup } from "@/components/logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/context/LanguageContext";
import { avatarStyleFor } from "@/lib/avatar-color";
import type { Me } from "@/lib/auth";
import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  href: string;
  /** Translation key for the label. */
  labelKey: string;
  icon: LucideIcon;
  /** Opens in a new tab instead of client-side navigation. */
  external?: boolean;
}

export interface DashboardBadge {
  icon: LucideIcon;
  label: string;
  sublabel: string;
}

interface DashboardShellProps {
  nav: readonly DashboardNavItem[];
  navLabel: string;
  homeHref: string;
  badge?: DashboardBadge;
  user: Me;
  onSignOut: () => void;
  children: ReactNode;
}

export function DashboardShell({ nav, navLabel, homeHref, badge, user, onSignOut, children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar nav={nav} navLabel={navLabel} homeHref={homeHref} user={user} onSignOut={onSignOut} />
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden [contain:layout]">
        <header className="hidden h-12 shrink-0 items-center justify-between border-b border-border/80 bg-card/80 px-6 backdrop-blur-md md:flex">
          {badge ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary ring-1 ring-primary/20">
                <badge.icon className="h-3 w-3" />
                {badge.label}
              </span>
              <span className="text-xs text-muted-foreground">{badge.sublabel}</span>
            </div>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3 md:hidden">
          <SidebarTrigger className="text-foreground hover:bg-muted" />
          <LogoLockup markSize={20} textClassName="text-sm" />
          <div className="ms-auto flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <main className="min-h-0 flex-1 overflow-auto overscroll-contain bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.04] via-background to-background p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

function DashboardSidebar({
  nav,
  navLabel,
  homeHref,
  user,
  onSignOut,
}: {
  nav: readonly DashboardNavItem[];
  navLabel: string;
  homeHref: string;
  user: Me;
  onSignOut: () => void;
}) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { tr } = useLanguage();
  const collapsed = !isMobile && state === "collapsed";
  const pathname = usePathname();

  const displayName = user.display_name || user.username;
  const initials = displayName.slice(0, 1).toUpperCase();
  const close = () => isMobile && setOpenMobile(false);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className={cn("flex w-full items-center", collapsed ? "justify-center" : "justify-between gap-2")}>
          {!collapsed && (
            <Link href={homeHref} className="min-w-0">
              <LogoLockup textClassName="text-sidebar-foreground" />
            </Link>
          )}
          {!isMobile && <SidebarTrigger />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroupLabel>{navLabel}</SidebarGroupLabel>
        {nav.map((item) => {
          const label = tr(item.labelKey);
          const active =
            !item.external &&
            (item.href === homeHref ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/"));
          const button = (
            <SidebarMenuButton active={active} collapsedLabel={label}>
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </SidebarMenuButton>
          );
          return item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(collapsed && "flex justify-center")}
            >
              {button}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={close}
              aria-current={active ? "page" : undefined}
              className={cn(collapsed && "flex justify-center")}
            >
              {button}
            </Link>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <Link href="/" onClick={close} className={cn(collapsed && "flex justify-center")}>
          <SidebarMenuButton collapsedLabel={tr("viewWebsite")}>
            <Globe className="h-4 w-4 shrink-0" />
            <span className="truncate">{tr("viewWebsite")}</span>
          </SidebarMenuButton>
        </Link>
        <SidebarMenuButton collapsedLabel={tr("logout")} onClick={onSignOut}>
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="truncate">{tr("logout")}</span>
        </SidebarMenuButton>

        {collapsed ? (
          <div className="mx-auto mt-1 flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-sidebar-border" title={displayName}>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-sm font-semibold" style={avatarStyleFor(String(user.id))}>
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="mt-1 flex w-full items-center gap-3 rounded-xl border border-sidebar-border/80 bg-sidebar-accent/40 px-2.5 py-2.5">
            <Avatar className="h-9 w-9 ring-2 ring-sidebar-border">
              <AvatarFallback className="text-sm font-semibold" style={avatarStyleFor(String(user.id))}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/55">
                {tr("signedInAs")} @{user.username}
              </p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
