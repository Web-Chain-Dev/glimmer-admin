import { Link, useRouterState } from "@tanstack/react-router";
import { Languages, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function PublicShell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Sparkles className="h-5 w-5 text-accent" />
            {t("app.title")}
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                pathname === "/" ? "font-medium" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("nav.catalog")}
            </Link>
            <Link
              to="/admin"
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                pathname.startsWith("/admin")
                  ? "font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("nav.admin")}
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "ru" ? "en" : "ru")}>
              <Languages className="mr-1.5 h-4 w-4" />
              {t("lang.switch")}
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
