import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-6">
            <BookOpen className="mr-1.5 h-3 w-3" />
            Blog
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            Creator Insights
          </h1>
          <p className="text-muted-foreground mt-4">
            Tips, tutorials, and updates from the ContentOS Studio team.
          </p>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardHeader className="py-16 text-center">
            <BookOpen className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
            <h2 className="text-lg font-semibold">Coming Soon</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              We&apos;re working on our first posts. Check back soon for creator
              tips, platform strategies, and product updates.
            </p>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
