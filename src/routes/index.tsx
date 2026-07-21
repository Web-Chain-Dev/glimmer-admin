import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listCategories, listItems, listItemTags } from "@/lib/db";
import { PublicShell } from "@/components/public-shell";
import { useI18n, catName } from "@/lib/i18n";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ювелирный каталог" },
      {
        name: "description",
        content: "Кольца, серьги, браслеты, подвески, цепи — авторские украшения ручной работы.",
      },
      { property: "og:title", content: "Ювелирный каталог" },
      {
        property: "og:description",
        content: "Кольца, серьги, браслеты, подвески, цепи — авторские украшения ручной работы.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, lang } = useI18n();
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const cats = useQuery({ queryKey: ["categories"], queryFn: listCategories });
  const items = useQuery({ queryKey: ["items"], queryFn: listItems });
  const tags = useQuery({ queryKey: ["item_tags"], queryFn: listItemTags });

  const primary = (cats.data ?? []).filter((c) => c.kind === "primary");
  const tagsByItem = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const tt of tags.data ?? []) {
      if (!m.has(tt.item_id)) m.set(tt.item_id, new Set());
      m.get(tt.item_id)!.add(tt.category_id);
    }
    return m;
  }, [tags.data]);
  const catMap = useMemo(() => {
    const m = new Map<string, (typeof primary)[number]>();
    for (const c of cats.data ?? []) m.set(c.id, c);
    return m;
  }, [cats.data]);

  const filtered = (items.data ?? []).filter(
    (i) => !activeCat || i.primary_category_id === activeCat,
  );

  return (
    <PublicShell>
      <section className="pb-8">
        <h1 className="text-4xl font-semibold tracking-tight">{t("app.title")}</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          {lang === "ru"
            ? "Авторские украшения — от классических колец до современных подвесок."
            : "Handcrafted jewelry — from classic rings to modern pendants."}
        </p>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCat(null)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition",
            !activeCat ? "border-foreground bg-foreground text-background" : "hover:bg-muted",
          )}
        >
          {t("catalog.viewAll")}
        </button>
        {primary.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition",
              activeCat === c.id
                ? "border-foreground bg-foreground text-background"
                : "hover:bg-muted",
            )}
          >
            {catName(c, lang)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          {t("catalog.empty")}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((it) => {
            const itemTagIds = tagsByItem.get(it.id) ?? new Set();
            const displayTags = Array.from(itemTagIds)
              .map((id) => catMap.get(id))
              .filter((c): c is NonNullable<typeof c> => !!c && c.kind === "tag")
              .filter((c) => c.slug === "new" || c.slug === "bestseller");
            return (
              <Link
                to="/item/$id"
                params={{ id: it.id }}
                key={it.id}
                className="group block overflow-hidden rounded-lg border bg-card transition hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {it.main_image_url ? (
                    <img
                      src={it.main_image_url}
                      alt={it.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                      no image
                    </div>
                  )}
                  {displayTags.length > 0 && (
                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                      {displayTags.map((tt) => (
                        <Badge key={tt.id} className="bg-accent text-accent-foreground">
                          {catName(tt, lang)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-3">
                  <div className="line-clamp-1 text-sm font-medium">{it.title}</div>
                  <div className="text-sm tabular-nums text-muted-foreground">
                    {Number(it.price).toLocaleString(lang === "ru" ? "ru-RU" : "en-US")} ₽
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PublicShell>
  );
}
