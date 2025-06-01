// src/sidebar/SideBar.tsx
import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import CreateClassroomModal from '../components/CreateClassroomModal';
import ParticipatingClassroomsModal from '../components/ParticipatingClassroomsModal';
import { useOwnedClassrooms, useEnrolledClassrooms } from '../services/classroomQueries';

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>(['2', '23']);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isParticipatingModalVisible, setIsParticipatingModalVisible] = useState(false);

  const { data: professorRooms = [] } = useOwnedClassrooms();
  const { data: studentRooms = [] } = useEnrolledClassrooms();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('23-')) {
      const id = key.replace('23-', '');
      if (id) {
        navigate(`/classroom/${id}`);
      }
      return;
    }

    switch (key) {
      case 'create-sala':
        setIsCreateModalVisible(true);
        break;
      case 'list-salas':
        setIsParticipatingModalVisible(true);
        break;
      case '1':
        navigate('/pt-bt/home');
        break;
      case '3':
        navigate('/calendar');
        break;
      case '4':
        navigate('/about');
        break;
      default:
        break;
    }
  };

  const generateRoomItems = (rooms: { id: string; name: string }[], prefix: string) => {
    return rooms.map((room) => ({
      key: `${prefix}-${room.id}`,
      label: room.name,
    }));
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
      label: 'Criar Sala',
    },
    {
      key: 'list-salas',
      icon: <UnorderedListOutlined />,
      label: 'Listar Salas',
    },
    {
      key: '2',
      icon: <AppstoreOutlined />,
      label: 'Sala de Aula',
      children: [
        {
          key: '23',
          label: 'Professor',
          children: generateRoomItems(professorRooms, '23'),
        },
        {
          key: '24',
          label: 'Aluno',
          children: generateRoomItems(studentRooms, '24'),
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
    },
  ];

  return (
    <div className="w-[12vw] flex-none overflow-y-auto flex-col flex justify-between">
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        onClick={handleMenuClick}
        style={{ width: '100%', height: '100%' }}
        items={items}
      />

      <CreateClassroomModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={(data) => console.log('Sala criada pelo Sidebar:', data)}
      />

      <ParticipatingClassroomsModal
        visible={isParticipatingModalVisible}
        onClose={() => setIsParticipatingModalVisible(false)}
        professorRooms={professorRooms}
        studentRooms={studentRooms}
      />
    </div>
  );
};

export default SideBar;
