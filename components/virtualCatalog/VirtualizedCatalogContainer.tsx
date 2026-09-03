'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ALL_MOCK_CATEGORIES } from '@/lib/api/virtualCatalogApi';
import { Category } from '@/lib/types/virtualCatalog';
import { stripBasePath, withBasePath } from '@/lib/sitePaths';
import { CategorySection } from './CategorySection';

interface VirtualizedCatalogContainerProps {
  onSelectSubcategory?: (subId: string, categoryId: string, subSection?: string) => void;
  selectedAnimal?: string;
}

interface LazyCategorySectionProps {
  category: Category;
  index: number;
  initiallyMounted: boolean;
  /** Принудительный монтаж (активный раздел при клике в навбаре). */
  forceMount: boolean;
  onSelectSubcategory?: (subId: string, categoryId: string, subSection?: string) => void;
}

/**
 * Лениво монтирует CategorySection при приближении к вьюпорту.
 * Вне зоны — размонтирует (оптимизация DOM), оставляя spacer по измеренной высоте.
 * При возврате секция монтируется снова; данные берутся из кэша без задержки.
 */
const LazyCategorySection: React.FC<LazyCategorySectionProps> = ({
  category,
  index,
  initiallyMounted,
  forceMount,
  onSelectSubcategory,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(initiallyMounted);
  const [lockedHeight, setLockedHeight] = useState<number | undefined>(undefined);
  const [isIntersecting, setIsIntersecting] = useState(initiallyMounted);
  /** Реальный контент уже был готов хотя бы раз (можно безопасно размонтировать). */
  const [contentReady, setContentReady] = useState(false);

  const shouldRender = isMounted || forceMount;

  // Spacer: пустой блок с фиксированной высотой, либо minHeight на время первого кадра после ремаунта.
  const containerStyle: React.CSSProperties | undefined =
    lockedHeight === undefined
      ? undefined
      : shouldRender
        ? { minHeight: lockedHeight }
        : { height: lockedHeight };

  const handleContentReady = useCallback(() => {
    setContentReady(true);
  }, []);

  // IntersectionObserver — единственный источник «близко / далеко».
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      setIsMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setIsMounted(true);
          return;
        }

        setIsIntersecting(false);
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Принудительный монтаж (клик в навбаре / активный раздел).
  useEffect(() => {
    if (forceMount) {
      setIsMounted(true);
    }
  }, [forceMount]);

  // Размонтирование только когда: далеко + контент уже был реальный + нет forceMount.
  // Высоту скелетона никогда не фиксируем — ждём contentReady.
  useLayoutEffect(() => {
    if (forceMount || isIntersecting || !contentReady || !isMounted) {
      return;
    }

    const el = sectionRef.current;
    if (el) {
      const height = el.getBoundingClientRect().height;
      if (height > 0) {
        setLockedHeight(height);
      }
    }
    setIsMounted(false);
  }, [forceMount, isIntersecting, contentReady, isMounted]);

  // После ремаунта (в т.ч. из кэша) снимаем spacer, когда контент снова в DOM.
  useLayoutEffect(() => {
    if (shouldRender && contentReady && lockedHeight !== undefined) {
      setLockedHeight(undefined);
    }
  }, [shouldRender, contentReady, lockedHeight]);

  return (
    <div
      ref={sectionRef}
      id={`category-${category.id}`}
      data-category-id={category.id}
      data-category-section="true"
      data-index={index}
      data-mounted={shouldRender ? 'true' : 'false'}
      className="scroll-mt-32 pb-8 sm:pb-12 border-b border-stone-100 last:border-0"
      style={containerStyle}
    >
      {shouldRender ? (
        <CategorySection
          category={category}
          onSelectSubcategory={onSelectSubcategory}
          onContentReady={handleContentReady}
        />
      ) : null}
    </div>
  );
};

export const VirtualizedCatalogContainer: React.FC<VirtualizedCatalogContainerProps> = ({
  onSelectSubcategory,
  selectedAnimal,
}) => {
  const categories: Category[] = useMemo(() => ALL_MOCK_CATEGORIES, []);

  // -1 = пользователь ещё в герое/промо, ни один раздел не активен.
  // Подсветка выставляется только скроллом или кликом, не из URL при маунте.
  const initialIndex = useMemo(() => {
    if (selectedAnimal && selectedAnimal !== 'all') {
      const idx = ALL_MOCK_CATEGORIES.findIndex((c) => c.id === selectedAnimal);
      return idx !== -1 ? idx : -1;
    }
    return -1;
  }, [selectedAnimal]);

  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [navMountAll, setNavMountAll] = useState(false);
  const lastDispatchedCatIdRef = useRef<string | null>(null);
  const activeIndexRef = useRef(activeIndex);
  const isClickScrollingRef = useRef(false);
  const clickScrollSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickScrollSafetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickScrollListenerRef = useRef<(() => void) | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  activeIndexRef.current = activeIndex;

  const clearClickScrollWatchers = useCallback(() => {
    if (clickScrollSettleTimerRef.current) {
      clearTimeout(clickScrollSettleTimerRef.current);
      clickScrollSettleTimerRef.current = null;
    }
    if (clickScrollSafetyTimerRef.current) {
      clearTimeout(clickScrollSafetyTimerRef.current);
      clickScrollSafetyTimerRef.current = null;
    }
    if (clickScrollListenerRef.current) {
      window.removeEventListener('scroll', clickScrollListenerRef.current);
      clickScrollListenerRef.current = null;
    }
  }, []);

  const finishClickScrolling = useCallback(() => {
    clearClickScrollWatchers();
    isClickScrollingRef.current = false;
    setNavMountAll(false);
  }, [clearClickScrollWatchers]);

  // Sync active category change to URL and custom event
  useEffect(() => {
    if (activeIndex < 0) {
      const hadCategory =
        lastDispatchedCatIdRef.current !== null &&
        lastDispatchedCatIdRef.current !== '';

      if (lastDispatchedCatIdRef.current !== '') {
        lastDispatchedCatIdRef.current = '';
        window.dispatchEvent(
          new CustomEvent('catalogActiveCategoryChange', { detail: '' })
        );
        // URL сбрасываем только когда ушли из раздела вверх, не при первом маунте
        if (hadCategory) {
          const path = stripBasePath(window.location.pathname);
          if (path === '/catalog' || /^\/catalog\/[a-z]+$/.test(path)) {
            window.history.replaceState(
              null,
              '',
              `${withBasePath('/catalog')}${window.location.search}`
            );
          }
        }
      }
      return;
    }

    const cat = categories[activeIndex];
    if (cat && cat.id !== lastDispatchedCatIdRef.current) {
      lastDispatchedCatIdRef.current = cat.id;
      window.dispatchEvent(
        new CustomEvent('catalogActiveCategoryChange', { detail: cat.id })
      );
      window.history.replaceState(
        null,
        '',
        `${withBasePath(`/catalog/${cat.id}`)}${window.location.search}`
      );
    }
  }, [activeIndex, categories]);

  // Smooth scroll to a category section by index with sticky header offset
  const handleSelectCategoryIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= categories.length) return;
      const targetCat = categories[index];
      if (!targetCat) return;

      // На время прыжка монтируем все секции, иначе незамеренные placeholder'ы
      // схлопывают документ и целевой offset получается неверным.
      clearClickScrollWatchers();
      setNavMountAll(true);
      setActiveIndex(index);
      isClickScrollingRef.current = true;

      const scrollToTarget = () => {
        const el = document.getElementById(`category-${targetCat.id}`);
        if (!el) {
          finishClickScrolling();
          return;
        }

        const headerOffset = 130;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        const targetTop = Math.max(0, offsetPosition);

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });

        // Unlock только когда секция реально у headerOffset — не по снимку targetTop,
        // который мог устареть после navMountAll / пересчёта layout выше цели.
        const NEAR_PX = 8;
        const isNearTarget = () =>
          Math.abs(el.getBoundingClientRect().top - headerOffset) <= NEAR_PX;

        let receivedScrollEvent = false;
        let didCorrectScroll = false;

        const scheduleSettle = () => {
          if (clickScrollSettleTimerRef.current) {
            clearTimeout(clickScrollSettleTimerRef.current);
          }
          clickScrollSettleTimerRef.current = setTimeout(() => {
            if (isNearTarget()) {
              finishClickScrolling();
              return;
            }
            // Layout сдвинулся — одна коррекция к актуальной позиции элемента.
            if (!didCorrectScroll) {
              didCorrectScroll = true;
              const correctedTop = Math.max(
                0,
                el.getBoundingClientRect().top + window.pageYOffset - headerOffset
              );
              window.scrollTo({ top: correctedTop, behavior: 'smooth' });
            }
            // Дальше ждём следующие scroll / safety.
          }, 180);
        };

        const onScrollDuringClick = () => {
          if (!isClickScrollingRef.current) return;
          receivedScrollEvent = true;
          scheduleSettle();
        };

        clickScrollListenerRef.current = onScrollDuringClick;
        window.addEventListener('scroll', onScrollDuringClick, { passive: true });

        // Уже на месте: scroll-событий может не быть.
        // Если ещё далеко — ждём scroll / safety, не unlock'аем по устаревшему targetTop.
        clickScrollSettleTimerRef.current = setTimeout(() => {
          if (receivedScrollEvent) return;
          if (isNearTarget()) {
            finishClickScrolling();
          }
        }, 250);

        clickScrollSafetyTimerRef.current = setTimeout(() => {
          finishClickScrolling();
        }, 3000);
      };

      // Двойной rAF: после коммита React и layout смонтированных секций.
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToTarget);
      });
    },
    [categories, clearClickScrollWatchers, finishClickScrolling]
  );

  useEffect(() => {
    return () => {
      clearClickScrollWatchers();
    };
  }, [clearClickScrollWatchers]);

  // Scroll to selected animal if requested via prop on initial load;
  // при возврате на /catalog (all) сбрасываем активный раздел.
  const prevSelectedAnimalRef = useRef(selectedAnimal);
  useEffect(() => {
    const prevAnimal = prevSelectedAnimalRef.current;
    prevSelectedAnimalRef.current = selectedAnimal;

    if (!selectedAnimal || selectedAnimal === 'all') {
      // Только при смене dog/cat/... → all, не при каждом ре-ране на /catalog
      if (prevAnimal && prevAnimal !== 'all' && activeIndexRef.current !== -1) {
        setActiveIndex(-1);
      }
      return;
    }

    const idx = categories.findIndex((c) => c.id === selectedAnimal);
    if (idx !== -1) {
      const timer = setTimeout(() => {
        handleSelectCategoryIndex(idx);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedAnimal, categories, handleSelectCategoryIndex]);

  // Listen to header navigation custom event (catalogScrollToCategory)
  useEffect(() => {
    const handleScrollTo = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const targetCatId = customEvent.detail;
      if (!targetCatId) return;

      const idx = categories.findIndex((c) => c.id === targetCatId);
      if (idx !== -1) {
        handleSelectCategoryIndex(idx);
      }
    };

    window.addEventListener('catalogScrollToCategory', handleScrollTo);
    return () => window.removeEventListener('catalogScrollToCategory', handleScrollTo);
  }, [categories, handleSelectCategoryIndex]);

  // Активный раздел: секция, пересекающая линию Y=150 (или ближайшая в зазоре).
  // Выше всех секций (герой/промо) — активных нет.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const HEADER_TARGET_Y = 150;

    const updateActiveFromScroll = () => {
      if (isClickScrollingRef.current) return;

      const sections = container.querySelectorAll<HTMLElement>(
        '[data-category-section="true"]'
      );
      if (sections.length === 0) return;

      const firstSection = sections[0];
      if (firstSection) {
        const firstTop = firstSection.getBoundingClientRect().top;
        // Ещё не доскроллили до каталога — не подсвечиваем «Кошки» и др.
        if (firstTop > HEADER_TARGET_Y) {
          if (activeIndexRef.current !== -1) {
            setActiveIndex(-1);
          }
          return;
        }
      }

      // Доскролл до низа страницы — всегда подсвечиваем последний раздел.
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 2) {
        const lastIdx = categories.length - 1;
        if (lastIdx >= 0 && lastIdx !== activeIndexRef.current) {
          setActiveIndex(lastIdx);
        }
        return;
      }

      let bestIdx = -1;
      let bestDistance = Infinity;

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        const catId = sec.getAttribute('data-category-id');
        if (!catId) return;

        const idx = categories.findIndex((c) => c.id === catId);
        if (idx === -1) return;

        // Секция пересекает линию под sticky-хедером.
        if (rect.top <= HEADER_TARGET_Y && rect.bottom > HEADER_TARGET_Y) {
          bestIdx = idx;
          bestDistance = 0;
          return;
        }

        if (bestDistance === 0) return;

        // Зазор между секциями: расстояние до ближайшего края.
        const distance =
          rect.bottom <= HEADER_TARGET_Y
            ? HEADER_TARGET_Y - rect.bottom
            : rect.top - HEADER_TARGET_Y;

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIdx = idx;
        }
      });

      if (bestIdx !== -1 && bestIdx !== activeIndexRef.current) {
        setActiveIndex(bestIdx);
      }
    };

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveFromScroll();
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveFromScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [categories]);

  return (
    <div className="w-full space-y-6">
      <div
        ref={containerRef}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative min-h-[600px] space-y-16"
      >
        {categories.map((category, index) => (
          <LazyCategorySection
            key={category.id}
            category={category}
            index={index}
            // Активный раздел и соседи монтируем сразу; вне разделов — первые два.
            initiallyMounted={
              initialIndex < 0
                ? index <= 1
                : Math.abs(index - initialIndex) <= 1
            }
            forceMount={navMountAll || (activeIndex >= 0 && index === activeIndex)}
            onSelectSubcategory={onSelectSubcategory}
          />
        ))}
      </div>
    </div>
  );
};
