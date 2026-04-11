import { Users } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Users"
        description="Manage administrator and internal user access to the CMS"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
            <Users className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              User listing and role editing UI are scheduled for the next milestone. Navigation and admin shell remain operational.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
