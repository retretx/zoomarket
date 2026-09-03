import { Category, SubCategory, PaginatedCategoriesResponse } from '../types/virtualCatalog';
import { CATALOG_STRUCTURE } from '../data';

// Full list of pet categories
export const ALL_MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat',
    slug: 'cat',
    name: 'Кошки',
    icon: '🐱',
    description: 'Все для замурчательного комфорта: полнорационные корма, наполнители, игровая мебель и ветаптека.',
    bannerGradient: 'from-orange-500 to-amber-600',
    subcategoriesCount: CATALOG_STRUCTURE.cat?.subcategories?.length || 10
  },
  {
    id: 'dog',
    slug: 'dog',
    name: 'Собаки',
    icon: '🐶',
    description: 'Профессиональные рационы, надежные поводки и шлейки, амуниция и игрушки для активных прогулок.',
    bannerGradient: 'from-amber-600 to-yellow-600',
    subcategoriesCount: CATALOG_STRUCTURE.dog?.subcategories?.length || 8
  },
  {
    id: 'bird',
    slug: 'bird',
    name: 'Птицы',
    icon: '🦜',
    description: 'Зерновые смеси премиум-класса, минеральные камни, качели, поилки и комфортные вольеры.',
    bannerGradient: 'from-emerald-500 to-teal-600',
    subcategoriesCount: CATALOG_STRUCTURE.bird?.subcategories?.length || 6
  },
  {
    id: 'rodent',
    slug: 'rodent',
    name: 'Грызуны',
    icon: '🐹',
    description: 'Альпийское сено, лакомства-палочки, беговые колеса и многоярусные клетки для хомяков и шиншилл.',
    bannerGradient: 'from-sky-500 to-blue-600',
    subcategoriesCount: CATALOG_STRUCTURE.rodent?.subcategories?.length || 5
  },
  {
    id: 'fish',
    slug: 'fish',
    name: 'Рыбки',
    icon: '🐠',
    description: 'Аквариумы, компрессоры, фильтрация, кондиционеры воды и сбалансированные хлопья.',
    bannerGradient: 'from-blue-600 to-indigo-700',
    subcategoriesCount: CATALOG_STRUCTURE.fish?.subcategories?.length || 6
  },
  {
    id: 'vet',
    slug: 'vet',
    name: 'Ветаптека',
    icon: '💊',
    description: 'Сертифицированные препараты от паразитов, пробиотики, хондропротекторы и диеты.',
    bannerGradient: 'from-rose-500 to-red-600',
    subcategoriesCount: CATALOG_STRUCTURE.vet?.subcategories?.length || 3
  },
  {
    id: 'brands',
    slug: 'brands',
    name: 'Бренды',
    icon: '🏷️',
    description: 'Производители кормов, лакомств и зоотоваров в ассортименте Айболита.',
    bannerGradient: 'from-stone-600 to-stone-800',
    subcategoriesCount: 1
  }
];

export function getAllCategories(): Category[] {
  return ALL_MOCK_CATEGORIES;
}

// In-memory cache for subcategories to prevent refetching/re-rendering flashes when virtualized items remount
const subcategoriesCache = new Map<string, SubCategory[]>();

// Helper to simulate network latency (500ms - 900ms)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Возвращает подкатегории только если они уже были загружены ранее; иначе null. */
export function getCachedSubcategories(categoryId: string): SubCategory[] | null {
  return subcategoriesCache.get(categoryId) ?? null;
}

export function hasCachedSubcategories(categoryId: string): boolean {
  return subcategoriesCache.has(categoryId);
}

/** Собирает подкатегории из источника данных без записи в кэш. */
function resolveSubcategories(categoryId: string): SubCategory[] {
  if (categoryId === 'brands') {
    return [];
  }

  const existingGroup = CATALOG_STRUCTURE[categoryId];

  if (existingGroup && existingGroup.subcategories.length > 0) {
    return existingGroup.subcategories.map((sub, idx) => ({
      id: sub.id,
      name: sub.name,
      icon: getSubcategoryIcon(sub.type, idx),
      type: sub.type,
      itemCount: 12 + ((idx * 7) % 40),
      subSections: sub.subSections || ['Все товары'],
      badge: idx % 3 === 0 ? 'Хит' : idx % 5 === 0 ? 'Скидка' : undefined
    }));
  }

  return generateGenericSubcategories(categoryId);
}

/**
 * План скелетона: число карточек в каждом блоке подкатегории.
 * Совпадает с реальным контентом, кэш не заполняет.
 */
export function getSubcategorySkeletonPlan(categoryId: string): number[] {
  if (categoryId === 'brands') {
    return [];
  }

  const source = getCachedSubcategories(categoryId) ?? resolveSubcategories(categoryId);
  return source.map((sub) =>
    sub.subSections && sub.subSections.length > 0 ? sub.subSections.length : 1
  );
}

export function getSubcategoriesSync(categoryId: string): SubCategory[] {
  const cached = getCachedSubcategories(categoryId);
  if (cached) {
    return cached;
  }

  const subcats = resolveSubcategories(categoryId);
  subcategoriesCache.set(categoryId, subcats);
  return subcats;
}

/**
 * Mock API endpoint for paginated Category retrieval.
 * Simulates backend pagination for infinite scrolling category lists.
 */
export async function fetchCategoriesPage(
  page: number = 1,
  limit: number = 10,
  latencyMs: number = 0
): Promise<PaginatedCategoriesResponse> {
  if (latencyMs > 0) {
    await delay(latencyMs);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = ALL_MOCK_CATEGORIES.slice(startIndex, endIndex);

  const hasMore = endIndex < ALL_MOCK_CATEGORIES.length;
  const nextPage = hasMore ? page + 1 : null;

  return {
    items,
    nextPage,
    total: ALL_MOCK_CATEGORIES.length,
    hasMore,
  };
}

/**
 * Mock API endpoint for fetching subcategories inside a single category.
 * Used by <CategorySection> when it mounts in the virtualizer viewport.
 * Уже закэшированные разделы отдаются мгновенно (без искусственной задержки).
 */
export async function fetchSubcategoriesForCategory(
  categoryId: string,
  latencyMs: number = 0
): Promise<SubCategory[]> {
  if (hasCachedSubcategories(categoryId)) {
    return getSubcategoriesSync(categoryId);
  }

  if (latencyMs > 0) {
    await delay(latencyMs);
  }

  return getSubcategoriesSync(categoryId);
}

function getSubcategoryIcon(type: string, idx: number): string {
  const icons = {
    food: ['🥣', '🥫', '🍖', '🥩'],
    toy: ['🪀', '🎾', '🐁', '🪵'],
    medicine: ['💊', '💧', '🩺', '🛡️'],
    accessory: ['🧺', '🛏️', '🧴', '✂️']
  };
  const list = icons[type as keyof typeof icons] || ['📦', '✨', '🐾', '🎯'];
  return list[idx % list.length];
}

function generateGenericSubcategories(categoryId: string): SubCategory[] {
  const map: Record<string, SubCategory[]> = {
    ferret: [
      { id: 'ferret-food', name: 'Высокопротеиновый корм', icon: '🥩', type: 'food', itemCount: 18, subSections: ['Сухой корм', 'Консервы'] },
      { id: 'ferret-hammock', name: 'Подвесные гамаки и трубы', icon: '🧺', type: 'accessory', itemCount: 24, subSections: ['Гамаки', 'Тоннели'] },
      { id: 'ferret-toys', name: 'Интерактивные лабиринты', icon: '🪀', type: 'toy', itemCount: 12, subSections: ['Мячики', 'Шуршалки'] },
      { id: 'ferret-hygiene', name: 'Шампуни для хорьков', icon: '🧴', type: 'accessory', itemCount: 15, subSections: ['Шампуни', 'Спреи от запаха'] }
    ],
    horse: [
      { id: 'horse-food', name: 'Мюсли, сено и подкормки', icon: '🌾', type: 'food', itemCount: 32, subSections: ['Мюсли', 'Соль-лизанец'] },
      { id: 'horse-hoof', name: 'Средства для ухода за копытами', icon: '👞', type: 'accessory', itemCount: 20, subSections: ['Мази', 'Деготь'] },
      { id: 'horse-gear', name: 'Амуниция и недузги', icon: '🎗️', type: 'accessory', itemCount: 45, subSections: ['Вальтрапы', 'Уздечки'] },
      { id: 'horse-vet', name: 'Мази для суставов и ветаптека', icon: '💊', type: 'medicine', itemCount: 16, subSections: ['Охлаждающие гели', 'Витамины'] }
    ],
    reptile: [
      { id: 'reptile-terrarium', name: 'Террариумы и декорации', icon: '🏞️', type: 'accessory', itemCount: 28, subSections: ['Стеклянные', 'Коряги'] },
      { id: 'reptile-lamp', name: 'УФ-лампы и обогрев', icon: '💡', type: 'accessory', itemCount: 22, subSections: ['УФB 10.0', 'Термоковрики'] },
      { id: 'reptile-food', name: 'Корма, насекомые и кальций', icon: '🦗', type: 'food', itemCount: 19, subSections: ['Кальций D3', 'Консервированные сверчки'] },
      { id: 'reptile-soil', name: 'Субстраты и кокосовая стружка', icon: '🪵', type: 'accessory', itemCount: 14, subSections: ['Кокос', 'Песок'] }
    ],
    vet: [
      { id: 'vet-flea', name: 'Капли и таблетки от клещей', icon: '🛡️', type: 'medicine', itemCount: 42, subSections: ['Симпарика', 'Бравекто', 'Инспектор'], badge: 'Важно' },
      { id: 'vet-diet', name: 'Лечебные диеты (Urinary, Gastro)', icon: '🩺', type: 'food', itemCount: 38, subSections: ['Gastrointestinal', 'Renal', 'Urinary'] },
      { id: 'vet-vitamins', name: 'Витаминные комплексы', icon: '💊', type: 'medicine', itemCount: 29, subSections: ['Для шерсти', 'Для суставов'] },
      { id: 'vet-calm', name: 'Успокаивающие средства', icon: '🌿', type: 'medicine', itemCount: 17, subSections: ['Капли', 'Диффузоры'] }
    ],
    hygiene: [
      { id: 'hygiene-shampoo', name: 'Шампуни и кондиционеры', icon: '🧴', type: 'accessory', itemCount: 35, subSections: ['Для смывки грязи', 'Гипоаллергенные'] },
      { id: 'hygiene-tools', name: 'Пуходерки и фурминаторы', icon: '✂️', type: 'accessory', itemCount: 26, subSections: ['Фурминаторы', 'Когтерезы'] },
      { id: 'hygiene-wipes', name: 'Влажные салфетки и лосьоны', icon: '🧻', type: 'accessory', itemCount: 21, subSections: ['Для ушей', 'Для глаз'] },
      { id: 'hygiene-odor', name: 'Устранение запахов и меток', icon: '✨', type: 'accessory', itemCount: 18, subSections: ['Спреи-энзимы', 'Поглотители'] }
    ]
  };

  return map[categoryId] || [
    { id: `${categoryId}-gen-1`, name: 'Основной уход и питание', icon: '🐾', type: 'food', itemCount: 20, subSections: ['Популярное'] },
    { id: `${categoryId}-gen-2`, name: 'Аксессуары и забавы', icon: '🪀', type: 'toy', itemCount: 15, subSections: ['Новинки'] }
  ];
}
