import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getItemFull, listCategories, listItems } from "@/lib/db";
import { PublicShell } from "@/components/public-shell";
import { useI18n, catName } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/item/$id")({
  component: ItemPage,
  notFoundComponent: () => (
    <PublicShell>
      <div className="py-16 text-center text-muted-foreground">Not found</div>
    </PublicShell>
  ),
});

function ItemPage() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const [heroIdx, setHeroIdx] = useState(0);

  const full = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const r = await getItemFull(id);
      if (!r) throw notFound();
      return r;
    },
  });
  const cats = useQuery({ queryKey: ["categories"], queryFn: listCategories });
  const allItems = useQuery({ queryKey: ["items"], queryFn: listItems });

  if (full.isLoading || !full.data) {
    return (
      <PublicShell>
        <div className="text-muted-foreground">{t("loading")}</div>
      </PublicShell>
    );
  }

  const { item, images, tagIds, recommendedIds } = full.data;
  const category = (cats.data ?? []).find((c) => c.id === item.primary_category_id);
  const tagList = (cats.data ?? []).filter((c) => tagIds.includes(c.id));
  const gallery = [item.main_image_url, ...images.map((i) => i.url)].filter(
    (u): u is string => !!u,
  );
  const hero = gallery[heroIdx] ?? gallery[0];
  const recs = (allItems.data ?? []).filter((i) => recommendedIds.includes(i.id));

  const sizeLabel =
    item.size && item.size_unit
      ? `${item.size} ${
          item.size_unit === "ru"
            ? lang === "ru"
              ? "(рос.)"
              : "(RU)"
            : item.size_unit
        }`
      : item.size ?? null;

  return (
    <PublicShell>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
            {hero ? (
              <img src={hero} alt={item.title} className="h-full w-full object-cover" />
            ) : null}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {gallery.map((u, i) => (
                <button
                  key={u + i}
                  onClick={() => setHeroIdx(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border ${
                    heroIdx === i ? "ring-2 ring-accent" : ""
                  }`}
                >
                  <img src={u} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {category && (
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {catName(category, lang)}
            </div>
          )}
          <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
          <div className="text-2xl tabular-nums">
            {Number(item.price).toLocaleString(lang === "ru" ? "ru-RU" : "en-US")} ₽
          </div>
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tagList.map((tt) => (
                <Badge key={tt.id} variant="secondary">
                  {catName(tt, lang)}
                </Badge>
              ))}
            </div>
          )}
          <dl className="grid gap-2 border-y py-4 text-sm">
            {item.material && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("field.material")}</dt>
                <dd>{item.material}</dd>
              </div>
            )}
            {sizeLabel && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("field.size")}</dt>
                <dd>{sizeLabel}</dd>
              </div>
            )}
          </dl>
          {item.description && (
            <div
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          )}
        </div>
      </div>

      {recs.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-semibold">
            {lang === "ru" ? "Рекомендуем" : "You may also like"}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {recs.map((r) => (
              <Link
                to="/item/$id"
                params={{ id: r.id }}
                key={r.id}
                className="group block overflow-hidden rounded-lg border bg-card transition hover:shadow-md"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  {r.main_image_url && (
                    <img
                      src={r.main_image_url}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-3">
                  <div className="line-clamp-1 text-sm font-medium">{r.title}</div>
                  <div className="text-sm text-muted-foreground tabular-nums">
                    {Number(r.price).toLocaleString(lang === "ru" ? "ru-RU" : "en-US")} ₽
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PublicShell>
  );
}
