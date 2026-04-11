'use client';

import { useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Filter, LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  name: string;
}

interface CatalogControlsLabels {
  searchPlaceholder: string;
  category: string;
  therapeuticArea: string;
  status: string;
  allCategories: string;
  allAreas: string;
  allStatuses: string;
  available: string;
  pipeline: string;
  apply: string;
  reset: string;
  filters: string;
  gridView: string;
  listView: string;
}

interface CatalogControlsProps {
  initialSearch: string;
  initialCategoryId: string;
  initialTherapeuticAreaId: string;
  initialStatus: '' | 'AVAILABLE' | 'PIPELINE';
  initialView: 'grid' | 'list';
  categories: FilterOption[];
  therapeuticAreas: FilterOption[];
  labels: CatalogControlsLabels;
}

export function CatalogControls({
  initialSearch,
  initialCategoryId,
  initialTherapeuticAreaId,
  initialStatus,
  initialView,
  categories,
  therapeuticAreas,
  labels,
}: CatalogControlsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [therapeuticAreaId, setTherapeuticAreaId] = useState(initialTherapeuticAreaId);
  const [status, setStatus] = useState<'AVAILABLE' | 'PIPELINE' | ''>(initialStatus);

  const hasFilters = useMemo(
    () => Boolean(search || categoryId || therapeuticAreaId || status),
    [search, categoryId, therapeuticAreaId, status]
  );

  const pushWithParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    const query = nextParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.push(url);
    });
  };

  const applyFilters = () => {
    pushWithParams({
      search: search || null,
      category: categoryId || null,
      therapeuticArea: therapeuticAreaId || null,
      status: status || null,
      page: null,
    });
  };

  const resetFilters = () => {
    setSearch('');
    setCategoryId('');
    setTherapeuticAreaId('');
    setStatus('');
    pushWithParams({
      search: null,
      category: null,
      therapeuticArea: null,
      status: null,
      page: null,
    });
  };

  const changeView = (view: 'grid' | 'list') => {
    pushWithParams({ view });
  };

  return (
    <section className="rounded-3xl border border-border/80 bg-card/95 p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            disabled={isPending}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {labels.filters}
          </Button>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground md:inline">
            {labels.filters}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 p-1">
          <Button
            variant={initialView === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => changeView('grid')}
            disabled={isPending}
          >
            <LayoutGrid className="h-4 w-4" />
            {labels.gridView}
          </Button>
          <Button
            variant={initialView === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => changeView('list')}
            disabled={isPending}
          >
            <List className="h-4 w-4" />
            {labels.listView}
          </Button>
        </div>
      </div>

      <div className={cn('mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4', !showMobileFilters && 'hidden md:grid')}>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={labels.searchPlaceholder}
          prefixIcon={<Search className="h-4 w-4" />}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              applyFilters();
            }
          }}
        />

        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {labels.category}
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-primary"
          >
            <option value="">{labels.allCategories}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {labels.therapeuticArea}
          <select
            value={therapeuticAreaId}
            onChange={(event) => setTherapeuticAreaId(event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-primary"
          >
            <option value="">{labels.allAreas}</option>
            {therapeuticAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {labels.status}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as 'AVAILABLE' | 'PIPELINE' | '')}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-primary"
          >
            <option value="">{labels.allStatuses}</option>
            <option value="AVAILABLE">{labels.available}</option>
            <option value="PIPELINE">{labels.pipeline}</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={applyFilters} disabled={isPending}>
          <Filter className="h-4 w-4" />
          {labels.apply}
        </Button>
        <Button variant="outline" onClick={resetFilters} disabled={isPending || !hasFilters}>
          {labels.reset}
        </Button>
      </div>
    </section>
  );
}
