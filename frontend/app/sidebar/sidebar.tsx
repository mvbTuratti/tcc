// src/sidebar/SideBar.tsx
import React, { useState, useEffect } from 'react';
import { Menu, Avatar, Button, message} from 'antd';
import {
  AppstoreOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import CreateClassroomModal from '../components/CreateClassroomModal';
import ParticipatingClassroomsModal from '../components/ParticipatingClassroomsModal';
import { useOwnedClassrooms, useEnrolledClassrooms, createClassroom } from '../services/classroomQueries';
import { fetchCurrentUser, logout } from '../services/userService';

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>(['2', '23']);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isParticipatingModalVisible, setIsParticipatingModalVisible] = useState(false);
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);

  const {
    data: professorRooms = [],
    isLoading: loadingProf,
    refetch: refetchOwnedClassrooms,
  } = useOwnedClassrooms();

  const {
    data: studentRooms = [],
    isLoading: loadingStudent,
    refetch: refetchEnrolledClassrooms,
  } = useEnrolledClassrooms();

  useEffect(() => {
    fetchCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

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

    const handleCreateClassroom = async (data: { name: string; description?: string }) => {
      try {
        await createClassroom(data.name, data.description);
        message.success('Sala criada com sucesso');
        refetchOwnedClassrooms();
        refetchEnrolledClassrooms();
      } catch (error) {
        message.error('Erro ao criar sala');
      }
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
        style={{ width: '100%' }}
        items={items}
      />

      <div className="p-4 text-center border-t border-gray-200">
        {user && (
          <>
            <Avatar
              size={48}
              src={user.picture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
              style={{ marginBottom: 8 }}
            />
            <div style={{ fontSize: 12, wordBreak: 'break-word' }}>{user.name}</div>
            <Button
              type="text"
              size="small"
              icon={<LogoutOutlined />}
              onClick={logout}
              style={{ marginTop: 8 }}
            >
              Logout
            </Button>
          </>
        )}
      </div>
        <CreateClassroomModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onCreate={handleCreateClassroom}
        />
        <ParticipatingClassroomsModal
          visible={isParticipatingModalVisible}
          onClose={() => setIsParticipatingModalVisible(false)}
          professorRooms={professorRooms}
          studentRooms={studentRooms}
          onRefetch={() => {
            refetchOwnedClassrooms();
            refetchEnrolledClassrooms();
          }}
        />
    </div>
  );
};

export default SideBar;