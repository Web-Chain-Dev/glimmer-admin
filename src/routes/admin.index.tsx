import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listCategories, listItems, listItemTags } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { useI18n, catName } from "@/lib/i18n";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/")({
  component: AdminItemsList,
});

function AdminItemsList() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const cats = useQuery({ queryKey: ["categories"], queryFn: listCategories });
  const items = useQuery({ queryKey: ["items"], queryFn: listItems });
  const tags = useQuery({ queryKey: ["item_tags"], queryFn: listItemTags });

  const catMap = useMemo(() => {
    const m = new Map<string, { name_ru: string; name_en: string; kind: string }>();
    for (const c of cats.data ?? []) m.set(c.id, c);
    return m;
  }, [cats.data]);

  const tagsByItem = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const t of tags.data ?? []) {
      if (!m.has(t.item_id)) m.set(t.item_id, []);
      m.get(t.item_id)!.push(t.category_id);
    }
    return m;
  }, [tags.data]);

  const filtered = (items.data ?? []).filter((it) =>
    q ? it.title.toLowerCase().includes(q.toLowerCase()) : true,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t("admin.items")}</h1>
        <Button asChild>
          <Link to="/admin/items/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("admin.newItem")}
          </Link>
        </Button>
      </div>

      <Input
        placeholder={t("search.placeholder")}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-sm"
      />

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="w-16 px-4 py-2"></th>
              <th className="px-4 py-2">{t("field.title")}</th>
              <th className="px-4 py-2">{t("field.category")}</th>
              <th className="px-4 py-2">{t("field.tags")}</th>
              <th className="px-4 py-2 text-right">{t("field.price")}</th>
              <th className="w-14 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  {t("loading")}
                </td>
              </tr>
            )}
            {!items.isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  {t("catalog.empty")}
                </td>
              </tr>
            )}
            {filtered.map((it) => {
              const cat = catMap.get(it.primary_category_id);
              const itemTagIds = tagsByItem.get(it.id) ?? [];
              return (
                <tr key={it.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-2">
                    {it.main_image_url ? (
                      <img
                        src={it.main_image_url}
                        alt=""
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted" />
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium">{it.title}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {cat ? catName(cat, lang) : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {itemTagIds.map((tid) => {
                        const c = catMap.get(tid);
                        return c ? (
                          <Badge key={tid} variant="secondary" className="text-xs">
                            {catName(c, lang)}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {Number(it.price).toLocaleString(lang === "ru" ? "ru-RU" : "en-US")} ₽
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button asChild size="icon" variant="ghost">
                      <Link
                        to="/admin/items/$id"
                        params={{ id: it.id }}
                        aria-label="edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
