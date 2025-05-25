// frontend/app/sidebar/SideBar.tsx
import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router';
import CreateClassroomModal from '../components/CreateClassroomModal';

const SideBar = () => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState(['2', '23']);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
   if (e.key === 'create-sala') {
     setIsModalVisible(true);
     return;
   }
    if (e.key === '1') navigate("/pt-bt/home");
    if (e.key === '3') navigate("/calendar");
    if (e.key === '4') navigate("/about");
  };

  const items: MenuProps['items'] = [

    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Página Inicial',
    },
    {
     key: 'create-sala',
     icon: <PlusCircleOutlined />,
     label: 'Criar Sala de Aula',
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
      icon: <CalendarOutlined />,
      label: 'Calendário',
    },
    {
      key: '4',
      icon: <InfoCircleOutlined />,
      label: 'Sobre',
    }
  ];

  return (
    <div className="w-[12vw] flex-none overflow-y-auto flex-col flex justify-between">
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        onClick={handleMenuClick}
        items={items}
        style={{ width: '100%', height: '100%', background: "#F9FAFB"}}
      />
     <CreateClassroomModal
       visible={isModalVisible}
       onClose={() => setIsModalVisible(false)}
       onCreate={(data) => console.log('SideBar criou:', data)}
     />
    </div>
  );
};

export default SideBar;
