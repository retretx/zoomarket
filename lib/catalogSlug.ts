/**
 * Нормализация сегментов URL каталога.
 * Защита от двойного encodeURIComponent (фильтры/сортировка по уже закодированному slug).
 */

/** Полностью раскодирует сегмент (в т.ч. после случайного двойного кодирования). */
export function decodeCatalogSlugSegment(segment: string): string {
  let result = segment;
  for (let i = 0; i < 5; i++) {
    try {
      const decoded = decodeURIComponent(result);
      if (decoded === result) break;
      result = decoded;
    } catch {
      break;
    }
  }
  return result;
}

/** Кодирует сегмент ровно один раз из «человеческого» значения. */
export function encodeCatalogSlugSegment(segment: string): string {
  return encodeURIComponent(decodeCatalogSlugSegment(segment));
}

/**
 * Варианты slug для generateStaticParams при output: 'export'.
 * next dev сравнивает urlPathname с pathname (не encodedPathname):
 * браузер шлёт /%D0%A1…/, Pages ищет папку «Сухой корм». Нужны оба.
 */
export function catalogSlugParamVariants(segments: string[]): string[][] {
  const decoded = segments.map(decodeCatalogSlugSegment);
  const encoded = decoded.map(encodeURIComponent);
  if (encoded.every((segment, i) => segment === decoded[i])) {
    return [decoded];
  }
  return [decoded, encoded];
}

/**
 * Подпись пилла «весь раздел»: согласование рода/числа с названием категории.
 * «Корм» → «Весь корм», «Лакомства» → «Все лакомства».
 */
export function getAllCategoryPillLabel(categoryName: string): string {
  const lower = categoryName.trim().toLowerCase();
  const first = lower.split(/[\s,]/)[0] ?? lower;

  // Множественное число (в т.ч. «корма», «лакомства», «умные»)
  if (
    /(?:ы|и|ые|ие|ства)$/.test(first) ||
    first === 'корма' ||
    first === 'средства'
  ) {
    return `Все ${lower}`;
  }

  // Женский род ед.ч.
  if (/[ая]$/.test(first) && !first.endsWith('мя')) {
    return `Вся ${lower}`;
  }

  // Средний род ед.ч.
  if (/[ое]$/.test(first)) {
    return `Всё ${lower}`;
  }

  // Мужской род ед.ч. («корм», …)
  return `Весь ${lower}`;
}
