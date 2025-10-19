export function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="border-t border-[rgb(var(--color-border))] mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-[rgb(var(--color-muted-foreground))] max-w-4xl">
          <p>© {currentYear} El Cyber. All rights reserved.</p>
        </div>
      </footer>
    );
  }