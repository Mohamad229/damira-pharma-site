import { notFound } from 'next/navigation';
import { PageEditorClient } from './page-editor-client';

/**
 * Edit Page
 *
 * Server component that fetches page data and passes it to the editor.
 * Uses async params per Next.js 16+ requirements.
 */
export const metadata = {
  title: 'Edit Page | Damira Admin',
  description: 'Edit website page content and sections',
};

interface EditPagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({
  params,
}: EditPagePageProps) {
  const { id } = await params;

  // Dynamically import to avoid Prisma initialization at build time
  const { getPageById } = await import('@/lib/actions/pages');
  const result = await getPageById(id);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageEditorClient page={result.data} />
    </div>
  );
}
