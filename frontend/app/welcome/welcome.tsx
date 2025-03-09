import language from "./language-repo.svg";
import temporary1 from "./temporary1.svg";
import calendario from "./calendario.svg";
import close from "./close.svg";
import google from "./google.svg";
import languageRepo from "./language-repo.svg";
import languageCom from "./language-svgrepo-com.svg";
import left from "./left.svg";
import login from "./login.svg";
import mensagens from "./mensagens.svg";
import menu from "./menu.svg";
import microsoft from "./microsoft.svg";
import plus from "./plus.svg";
import register from "./register.svg";
import right from "./right.svg";
import spy from "./spy.svg";
import testes from "./testes.svg";
import videocall from "./videocall.svg";
import { App, Button, Space } from 'antd';

interface WelcomeParams {
  lang: string;
}
export function Welcome({ lang }: WelcomeParams) {
  const { message, modal, notification } = App.useApp();
  const showNotification = () => {
    notification.info({
      message: 'Notification topLeft',
      description: 'Hello, Ant Design!!',
      placement: 'topLeft',
    });
  };
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
        { lang }
            <img
              src={language}
              alt="React Router"
              className="h-12 w-12"
            />
            <img
              src={mensagens}
              alt="React Router"
              className=""
            />
            <Space wrap>
            <Button type="primary" onClick={showNotification}>
        Open notification
      </Button>
            </Space>
    </main>
  );
}

const resources = [

];
