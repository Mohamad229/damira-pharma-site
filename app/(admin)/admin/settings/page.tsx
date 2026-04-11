import { Settings } from 'lucide-react';

import { PageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure platform behavior and default administration preferences"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
            <Settings className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Settings controls are intentionally deferred to a future milestone. The admin shell is fully available.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
