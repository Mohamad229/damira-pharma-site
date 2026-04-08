import { PageHeader } from '@/components/admin/page-header';
import { PageFormClient } from '../page-form-client';

/**
 * Create New Page
 *
 * Server component that renders the page creation form.
 * Passes mode="create" to form component.
 */
export const metadata = {
  title: 'Add New Page | Damira Admin',
  description: 'Create a new website page',
};

export default function NewPagePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Page"
        description="Create a new website page with SEO metadata"
      />

      <PageFormClient mode="create" />
    </div>
  );
}
