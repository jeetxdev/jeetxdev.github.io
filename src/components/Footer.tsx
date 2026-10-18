export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-page px-5 py-6 font-mono text-[12px] text-muted sm:px-8">
        <span>built by hand, deployed with nerve · {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
