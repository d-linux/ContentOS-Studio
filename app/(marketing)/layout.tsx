import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (userId) {
    redirect("/create");
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            ContentOS Studio
          </Link>

          <Link
            href="/demo"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Demo
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Brand */}
            <div className="space-y-3">
              <p className="text-lg font-bold tracking-tight">
                ContentOS Studio
              </p>
              <p className="text-muted-foreground text-sm">
                Your Personal Video Director. AI-powered scripts that learn your
                voice.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <p className="text-sm font-semibold">Pages</p>
              <nav className="flex flex-col gap-2">
                {[
                  { href: "/demo", label: "Demo" },
                  { href: "/blog", label: "Blog" },
                  { href: "/help", label: "Help" },
                  { href: "/privacy", label: "Privacy" },
                  { href: "/terms", label: "Terms" },
                  { href: "/links", label: "Links" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social */}
            <div className="space-y-3">
              <p className="text-sm font-semibold">Social</p>
              <nav className="flex flex-col gap-2">
                {[
                  {
                    href: "https://instagram.com",
                    label: "Instagram",
                  },
                  {
                    href: "https://tiktok.com",
                    label: "TikTok",
                  },
                  {
                    href: "https://youtube.com",
                    label: "YouTube",
                  },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="text-muted-foreground mt-10 border-t pt-6 text-center text-sm">
            &copy; {new Date().getFullYear()} ContentOS Studio. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
