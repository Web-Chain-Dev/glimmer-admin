import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ru" | "en";

const dict = {
  ru: {
    "app.title": "Ювелирный каталог",
    "nav.catalog": "Каталог",
    "nav.admin": "Админ",
    "admin.title": "Панель управления",
    "admin.items": "Товары",
    "admin.categories": "Категории и теги",
    "admin.catalogTabs": "Вкладки каталога",
    "admin.order": "Порядок",
    "admin.orderHint": "Перетащите товары, чтобы изменить порядок в каталоге.",
    "admin.tabsHint": "Выберите категории и теги, которые появятся вкладками в каталоге. Перетащите, чтобы изменить порядок.",
    "admin.newItem": "Новый товар",
    "admin.editItem": "Редактировать товар",
    "admin.deleteItem": "Удалить",
    "admin.confirmDelete": "Удалить этот товар?",
    "admin.save": "Сохранить",
    "admin.cancel": "Отмена",
    "admin.saving": "Сохранение...",
    "admin.saved": "Сохранено",
    "admin.deleted": "Удалено",
    "admin.error": "Ошибка",
    "field.title": "Название",
    "field.slug": "URL (slug)",
    "field.price": "Цена",
    "field.material": "Материал",
    "field.description": "Описание",
    "field.category": "Категория",
    "field.tags": "Теги",
    "field.size": "Размер",
    "field.sizeUnit": "Единица размера",
    "field.mainImage": "Главное изображение",
    "field.stock": "В наличии",
    "field.sizes": "Размеры и наличие",
    "field.stockOnly": "Количество на складе",
    "sizes.add": "Добавить размер",
    "sizes.remove": "Удалить",
    "field.detailImages": "Дополнительные изображения",
    "field.recommendations": "Рекомендуемые товары",
    "unit.ru": "Российский размер",
    "unit.cm": "см",
    "unit.mm": "мм",
    "cat.new": "Новая категория",
    "cat.newTag": "Новый тег",
    "cat.name_ru": "Название (рус)",
    "cat.name_en": "Название (англ)",
    "cat.slug": "Slug",
    "cat.add": "Добавить",
    "cat.system": "Системная",
    "cat.primary": "Основные категории",
    "cat.tags": "Теги",
    "cat.delete": "Удалить",
    "cat.kindPrimary": "Тип",
    "cat.kindTag": "Тег",
    "upload.uploading": "Загрузка...",
    "upload.dropOrClick": "Нажмите или перетащите файл",
    "upload.remove": "Удалить",
    "editor.bold": "Жирный",
    "editor.italic": "Курсив",
    "editor.color": "Цвет",
    "editor.h2": "Заголовок",
    "editor.bullet": "Список",
    "editor.link": "Ссылка",
    "catalog.empty": "Пока нет товаров",
    "catalog.viewAll": "Все товары",
    "catalog.details": "Подробнее",
    "search.placeholder": "Поиск товаров...",
    "lang.switch": "EN",
    "back": "Назад",
    "loading": "Загрузка...",
    "select.none": "—",
    "select.placeholder": "Выберите...",
  },
  en: {
    "app.title": "Jewelry catalog",
    "nav.catalog": "Catalog",
    "nav.admin": "Admin",
    "admin.title": "Admin dashboard",
    "admin.items": "Items",
    "admin.categories": "Categories & tags",
    "admin.catalogTabs": "Catalog tabs",
    "admin.order": "Order",
    "admin.orderHint": "Drag items to change the order they appear in the catalog.",
    "admin.tabsHint": "Pick which categories and tags appear as tabs in the catalog. Drag to reorder.",
    "admin.newItem": "New item",
    "admin.editItem": "Edit item",
    "admin.deleteItem": "Delete",
    "admin.confirmDelete": "Delete this item?",
    "admin.save": "Save",
    "admin.cancel": "Cancel",
    "admin.saving": "Saving...",
    "admin.saved": "Saved",
    "admin.deleted": "Deleted",
    "admin.error": "Error",
    "field.title": "Title",
    "field.slug": "URL (slug)",
    "field.price": "Price",
    "field.material": "Material",
    "field.description": "Description",
    "field.category": "Category",
    "field.tags": "Tags",
    "field.size": "Size",
    "field.sizeUnit": "Size unit",
    "field.mainImage": "Main image",
    "field.stock": "In stock",
    "field.sizes": "Sizes & stock",
    "field.stockOnly": "Stock quantity",
    "sizes.add": "Add size",
    "sizes.remove": "Remove",
    "field.detailImages": "Detail images",
    "field.recommendations": "Recommendations",
    "unit.ru": "Russian ring size",
    "unit.cm": "cm",
    "unit.mm": "mm",
    "cat.new": "New category",
    "cat.newTag": "New tag",
    "cat.name_ru": "Name (RU)",
    "cat.name_en": "Name (EN)",
    "cat.slug": "Slug",
    "cat.add": "Add",
    "cat.system": "System",
    "cat.primary": "Primary categories",
    "cat.tags": "Tags",
    "cat.delete": "Delete",
    "cat.kindPrimary": "Type",
    "cat.kindTag": "Tag",
    "upload.uploading": "Uploading...",
    "upload.dropOrClick": "Click or drop a file",
    "upload.remove": "Remove",
    "editor.bold": "Bold",
    "editor.italic": "Italic",
    "editor.color": "Color",
    "editor.h2": "Heading",
    "editor.bullet": "List",
    "editor.link": "Link",
    "catalog.empty": "No items yet",
    "catalog.viewAll": "All items",
    "catalog.details": "Details",
    "search.placeholder": "Search items...",
    "lang.switch": "РУ",
    "back": "Back",
    "loading": "Loading...",
    "select.none": "—",
    "select.placeholder": "Select...",
  },
} as const;

type Key = keyof (typeof dict)["ru"];

const I18nContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "ru",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (saved === "ru" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: Key) => dict[lang][k] ?? k;

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function catName(c: { name_ru: string; name_en: string }, lang: Lang) {
  return lang === "ru" ? c.name_ru : c.name_en;
}
