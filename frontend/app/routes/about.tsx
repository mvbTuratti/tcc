import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "L2L" },
    { name: "description", content: "Início" },
  ];
}

export default function About() {
  return (<>Test</>);
}
