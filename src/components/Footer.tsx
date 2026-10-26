export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-page px-4 pt-6 pb-8 font-mono text-xs text-muted sm:px-8">
        <span>built by hand, deployed with nerve · {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
