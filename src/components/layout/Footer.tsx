export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Storefront Vista. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Powered by Next.js & TailwindCSS
        </p>
      </div>
    </footer>
  );
}
