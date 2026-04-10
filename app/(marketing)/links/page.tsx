import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com",
    description: "Behind the scenes & creator tips",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com",
    description: "Short-form content & tutorials",
  },
  {
    name: "YouTube",
    url: "https://youtube.com",
    description: "Full demos & creator spotlights",
  },
];

export default function LinksPage() {
  return (
    <div className="flex flex-col items-center px-6 py-20">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Brand */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            ContentOS Studio
          </h1>
          <p className="text-muted-foreground text-sm">
            Your Personal Video Director
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="hover:bg-accent transition-colors">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div className="text-left">
                    <CardTitle className="text-base">{link.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {link.description}
                    </p>
                  </div>
                  <ExternalLink className="text-muted-foreground h-4 w-4 shrink-0" />
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
