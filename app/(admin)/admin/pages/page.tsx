import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PagesTableClient } from './pages-table-client';

/**
 * Admin Pages Listing Page
 *
 * Server component that displays all pages with management capabilities.
 * Provides table view with sorting, searching, and bulk operations.
 */
export const metadata = {
  title: 'Manage Pages | Damira Admin',
  description: 'View and manage all website pages',
};

export default function AdminPagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Pages"
        description="View and manage all website pages and their content"
        actions={
          <Link href="/admin/pages/new">
            <Button size="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Page
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Suspense fallback={<div className="p-6 text-center text-muted-foreground">Loading pages...</div>}>
            <PagesTableClient />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
