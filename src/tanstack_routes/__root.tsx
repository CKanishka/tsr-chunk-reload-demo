import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

const RootLayout = () => (
  <>
    <div className="hint">
      <strong>Chunk reload demo.</strong> Open DevTools → Network. After a
      rebuild, navigating to About/Dashboard/Settings should auto-reload once
      when the old chunk 404s.
    </div>
    <nav>
      <Link to="/" activeOptions={{ exact: true }}>
        Home
      </Link>
      <Link to="/about">About</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/settings">Settings</Link>
    </nav>
    <Outlet />
  </>
);

export const Route = createRootRoute({
  component: RootLayout,
});
