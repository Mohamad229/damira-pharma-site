import { Inbox } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FormsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Form Submissions"
        description="Review and manage incoming contact and partnership submissions"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submission Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Forms management is planned for a future milestone. The admin shell and route are active.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
