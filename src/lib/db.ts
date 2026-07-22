import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  slug: string;
  name_ru: string;
  name_en: string;
  kind: "primary" | "tag";
  sort_order: number;
  is_system: boolean;
};

export type Item = {
  id: string;
  title: string;
  price: number;
  material: string | null;
  description: string | null;
  primary_category_id: string;
  size: string | null;
  size_unit: "ru" | "cm" | "mm" | null;
  main_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ItemImage = { id: string; item_id: string; url: string; sort_order: number };

export type ItemSize = {
  id: string;
  item_id: string;
  size: string | null;
  size_unit: "ru" | "cm" | "mm" | null;
  stock: number;
  sort_order: number;
};

export async function listCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("kind")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function listItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Item[];
}

export async function listItemTags() {
  const { data, error } = await supabase.from("item_tags").select("*");
  if (error) throw error;
  return (data ?? []) as { item_id: string; category_id: string }[];
}

export async function getItemFull(id: string) {
  const [itemRes, imgsRes, tagsRes, recRes] = await Promise.all([
    supabase.from("items").select("*").eq("id", id).maybeSingle(),
    supabase.from("item_images").select("*").eq("item_id", id).order("sort_order"),
    supabase.from("item_tags").select("category_id").eq("item_id", id),
    supabase
      .from("item_recommendations")
      .select("recommended_item_id, sort_order")
      .eq("item_id", id)
      .order("sort_order"),
  ]);
  if (itemRes.error) throw itemRes.error;
  if (!itemRes.data) return null;
  return {
    item: itemRes.data as Item,
    images: (imgsRes.data ?? []) as ItemImage[],
    tagIds: (tagsRes.data ?? []).map((r) => r.category_id as string),
    recommendedIds: (recRes.data ?? []).map((r) => r.recommended_item_id as string),
  };
}
