import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import SideBar from './sidebar/sidebar'
import { Spin, App as AntApp, Card, ConfigProvider} from "antd";
import type { ThemeConfig } from 'antd';


import type { Route } from "./+types/root";
import "./app.css";

const primaryColor = '#16A34A';
const primaryColorHover = '#059669';
const primaryColorActive = '#047857';

const antdPrimary = '#16A34A';       // Seu verde principal (Tailwind green-600)
const antdPrimaryHover = '#059669';  // Seu verde para hover (Tailwind green-700)
const antdPrimaryActive = '#047857'; // Seu verde para clique/ativo (Tailwind green-800)

const defaultAntdTextColor = 'rgba(0, 0, 0, 0.88)';
const lightGreenBackgroundHover = '#f0fdf4';

const antdTheme: ThemeConfig = {
  // Tokens globais aplicados a todos os componentes (quando aplicável)
  token: {
    colorPrimary: antdPrimary, // Cor primária principal para a aplicação
    // colorTextBase: defaultAntdTextColor, // Cor de texto base (opcional, se quiser mudar o padrão)
  },
  // Personalizações específicas por componente
  components: {
    Button: {
      // colorPrimary para o fundo do botão primário será herdado de token.colorPrimary
      colorPrimaryHover: antdPrimaryHover,    // Cor do fundo do botão primário no hover
      colorPrimaryActive: antdPrimaryActive,  // Cor do fundo do botão primário quando clicado/ativo

      // Se quiser customizar botões 'default' (não primários) no hover:
      // defaultHoverBg: lightGreenBackgroundHover,
      // defaultHoverBorderColor: antdPrimary,
      // defaultHoverColor: antdPrimary,
    },
    Tabs: {
      // itemSelectedColor (cor do texto da aba selecionada) e
      // inkBarColor (cor da linha abaixo da aba selecionada)
      // herdarão de token.colorPrimary por padrão.
      // Se precisar de cores diferentes especificamente para abas:
      // itemSelectedColor: antdPrimary,
      // inkBarColor: antdPrimary,

      itemHoverColor: antdPrimaryHover, // Cor do texto da aba (que não está selecionada) ao passar o mouse.
                                        // Isso afeta o .ant-tabs-tab-btn no hover.
      itemColor: defaultAntdTextColor,  // Cor do texto da aba não selecionada em estado normal.
    },
    Pagination: {
      // colorPrimary (herdado de token.colorPrimary) aqui é bem poderoso. Ele geralmente afeta:
      // - A cor de fundo do item da página atualmente selecionada.
      // - A cor do texto e da borda dos outros números de página ao passar o mouse (hover).
      // - A cor das setas de navegação ao passar o mouse.

      // colorPrimaryHover pode ser usado para o estado de hover do item *ativo* da paginação,
      // se você quiser que seja diferente do token.colorPrimaryHover global (se este for definido)
      // ou do comportamento padrão de hover do item ativo.
      // Exemplo: colorPrimaryHover: antdPrimaryHover, // (Cor de fundo do item ativo no hover)

      // A cor do texto do item da página ativa geralmente se torna branca automaticamente
      // se a cor de fundo (colorPrimary) for escura o suficiente para contraste.

      // Para customizar o fundo dos itens não ativos no hover (se o padrão não agradar):
      // itemHoverBg: lightGreenBackgroundHover, // Fundo do item não ativo no hover
    },
  },
};

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
        <ConfigProvider theme={antdTheme}>
          <AntApp> {}
            <div className="flex flex-col min-h-screen h-screen">
              <div className="flex-1 flex overflow-y-hidden">
                <SideBar /> {}
                <div className="bg-green-200 flex-1 flex overflow-y-auto">
                  {children} {}
                </div>
              </div>
            </div>
          </AntApp>
        </ConfigProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Application() {
  return <Outlet />;
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
