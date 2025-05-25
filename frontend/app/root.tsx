import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import SideBar from './sidebar/sidebar'
import { Spin, App, Card } from "antd";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col min-h-screen h-screen">
          {/* <div className="bg-red-500 flex">
            <div className="bg-red-300 w-56 flex-none">Test</div>
            <div>Test 2</div>
          </div> */}
          <div className="flex-1 flex overflow-y-hidden">
            <SideBar></SideBar>
            <div className="bg-green-200 flex-1 flex overflow-y-auto">
              {children}
              </div>
            </div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Change here for adding whole app state mgmt
export default function Application() {
  return (
  <App>
    <Outlet />
  </App>);
}

export function HydrateFallback() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#bbf7d0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          background: "#F9FAFB",
          padding: 24,
          borderRadius: 8,
          textAlign: "center",
          width: 300,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Spin size="large" />
        <div style={{ marginTop: 16, fontWeight: 500 }}>Carregando...</div>
      </Card>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
