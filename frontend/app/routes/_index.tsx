import type { Route } from "./+types/home";
import { redirect } from "react-router";
import { Flex, Spin } from 'antd';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "L2L" },
    { name: "description", content: "Home" },
  ];
}

export async function loader({ params }: any) {
  // let userLang = navigator.language || "pt-br";
  // return redirect(`/${userLang}/home`);
}

export default function Home() {
  return (
    <>
    <Flex align="center bg-red-500" gap="middle">
      <Spin size="large" />
    </Flex>
  </>
  );
}