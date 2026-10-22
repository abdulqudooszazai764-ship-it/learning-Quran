"use client";

/**
 * Collapsible Sidebar — light mode = light sidebar, dark mode = navy.
 * Desktop: fixed column, collapsible to icon-only via the header toggle.
 * Mobile (<768px): the column is never rendered inline — it opens as a
 * slide-over Sheet instead, triggered by the same SidebarTrigger button.
 */
import * as React from "react";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "4rem";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const MOBILE_BREAKPOINT = 768; // matches Tailwind's `md`

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  const [hydrated, setHydrated] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);

  React.useEffect(() => {
    const saved = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
      ?.split("=")[1];
    if (saved !== undefined) setOpen(saved === "true");
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const toggle = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
      return;
    }
    setOpen((prev) => {
      const next = !prev;
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      return next;
    });
  }, [isMobile]);

  const setOpenPersisted = React.useCallback((value: boolean) => {
    setOpen(value);
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, []);

  const effectiveOpen = hydrated ? open : true;

  const state = effectiveOpen ? "expanded" : "collapsed"
  const value = React.useMemo(
    () => ({
      state: state as "expanded" | "collapsed",
      open: effectiveOpen,
      toggle,
      setOpen: setOpenPersisted,
      isMobile,
      openMobile,
      setOpenMobile,
    }),
    [state, effectiveOpen, toggle, setOpenPersisted, isMobile, openMobile]
  )

  return (
    <SidebarContext.Provider value={value}>
      <div
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          } as React.CSSProperties
        }
        className="flex h-screen w-full overflow-hidden"
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    // Slide in from the reading-start edge (right for RTL languages).
    const rtl = typeof document !== "undefined" && document.documentElement.dir === "rtl";
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={rtl ? "right" : "left"}
          className="w-[var(--sidebar-width)] max-w-[85vw] flex-col gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground [&>button]:text-sidebar-foreground/70 [&>button]:hover:text-sidebar-foreground"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      data-state={state}
      className={cn(
        "hidden h-full shrink-0 flex-col overflow-hidden border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width] md:flex",
        state === "expanded" ? "w-[var(--sidebar-width)]" : "w-[var(--sidebar-width-icon)]",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle, state } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={state === "expanded"}
      className={cn(
        "h-9 w-9 shrink-0 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        className
      )}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  );
}

export function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  const { state, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col border-b border-sidebar-border",
        collapsed ? "items-center p-2.5" : "gap-2 p-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  const { state, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  return (
    <div
      className={cn(
        "mt-auto flex shrink-0 flex-col border-t border-sidebar-border",
        collapsed ? "items-center p-2.5" : "gap-1 p-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { state, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  return (
    <div
      className={cn(
        "flex flex-1 flex-col overflow-x-hidden overflow-y-auto",
        collapsed ? "items-center gap-1.5 px-2 py-3" : "gap-1 p-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  const { state, isMobile } = useSidebar();
  if (!isMobile && state === "collapsed") return null;
  return (
    <p className="px-2 pb-1 pt-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/45">
      {children}
    </p>
  );
}

export function SidebarMenuButton({
  children,
  active,
  collapsedLabel,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  collapsedLabel?: string;
}) {
  const { state, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  const childArray = React.Children.toArray(children);

  const visibleChildren = collapsed
    ? childArray.filter((child) => {
        if (!React.isValidElement(child)) return false;
        return typeof child.type !== "string" || child.type === "svg";
      })
    : childArray;

  return (
    <button
      type="button"
      {...props}
      title={collapsed ? collapsedLabel : undefined}
      className={cn(
        "group/menu-button relative flex items-center overflow-hidden rounded-xl text-sm font-medium transition-all duration-150",
        collapsed
          ? "h-10 w-10 shrink-0 justify-center p-0 [&_span]:hidden"
          : "w-full gap-3 px-3 py-2.5",
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        className
      )}
    >
      {visibleChildren.map((child, i) => {
        if (!React.isValidElement(child)) return child;
        if (!collapsed) return child;
        return React.cloneElement(child as React.ReactElement<{ className?: string }>, {
          key: i,
          className: cn((child.props as { className?: string }).className, "!h-5 !w-5 shrink-0"),
        });
      })}
    </button>
  );
}
