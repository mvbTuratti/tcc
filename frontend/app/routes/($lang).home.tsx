import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

interface HomeLanguage {
    params: {
        lang: string;
      };
}

export function meta({params}: Route.MetaArgs) {
    const { lang } = params;
    const title = lang === "pt-BR" ? "L2L - Início" : "L2L - Welcome";
    const description = lang === "fr" ? "Início" : "Home";
    return [
        { title },
        { name: "description", content: description },
    ];
}

export default function Home({ params }: HomeLanguage) {
  return <Welcome lang={params.lang} />;
}