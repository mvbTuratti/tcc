import React, { useState } from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from "react-router"; // Certifique-se de que sua versão suporta esse hook

type MenuItem = Required<MenuProps>['items'][number];

const SideBar = () => {
  // Chame o hook useNavigate no topo do componente
  const navigate = useNavigate();
  const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);

  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    setStateOpenKeys(openKeys);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '1') {
      navigate("/pt-bt/home");
    } 
    if (e.key === '3') {
        navigate("/calendar")
    }
    if (e.key === '4') {
        navigate("/about")
    }
    console.log("here")
  };

  const items: MenuItem[] = [
    {
      key: '1',
      icon: <MailOutlined />,
      label: 'Pagina Inicial',
    },
    {
      key: '2',
      icon: <AppstoreOutlined />,
      label: 'Sala de Aula',
      children: [
        {
          key: '23',
          label: 'Professor',
          children: [
            { key: '231', label: 'Option 1' },
            { key: '232', label: 'Option 2' },
            { key: '233', label: 'Option 3' },
          ],
        },
        {
          key: '24',
          label: 'Aluno',
          children: [
            { key: '241', label: 'Option 1' },
            { key: '242', label: 'Option 2' },
            { key: '243', label: 'Option 3' },
          ],
        },
      ],
    },
    {
        key: '3',
        icon: <SettingOutlined />,
        label: 'Calendário',
  
      },
    {
      key: '4',
      icon: <SettingOutlined />,
      label: 'Sobre',

    },
  ];

  return (
    <div className="w-[12vw] flex-none overflow-y-auto flex-col flex justify-between">
      <Menu
        mode="inline"
        defaultSelectedKeys={['231']}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        onClick={handleMenuClick}
        style={{ width: 256, height: '100%' }}
        items={items}
      />
      <div className="bg-green-100">Test2</div>
    </div>
  );
};

export default SideBar;
