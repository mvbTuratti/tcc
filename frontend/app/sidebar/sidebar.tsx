import React, { useState } from 'react';
import { Menu, Row, Button } from 'antd';
import {
  AppstoreOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router';
import CreateClassroomModal from '../components/CreateClassroomModal';
import ParticipatingClassroomsModal from '../components/ParticipatingClassroomsModal';
import type { ClassroomSummary } from '../routes/Home';

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>(['2', '23']);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isParticipatingModalVisible, setIsParticipatingModalVisible] = useState(false);

  // dados mockados para exemplo
  const professorRooms: ClassroomSummary[] = [
    { name: 'Sala de Matemática', instructor: 'Prof. João' },
    { name: 'Sala de Física', instructor: 'Prof. Ana' },
    { name: 'Sala de Química', instructor: 'Prof. Carlos' },
    { name: 'Sala de História', instructor: 'Prof. Maria' },
  ];
  const studentRooms: ClassroomSummary[] = [
    { name: 'Sala de Biologia', instructor: 'Prof. Pedro' },
    { name: 'Sala de Geografia', instructor: 'Prof. Luiza' },
    { name: 'Sala de Inglês', instructor: 'Prof. Carla' },
    { name: 'Sala de Espanhol', instructor: 'Prof. Marcos' },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
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
