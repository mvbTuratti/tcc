// src/components/ParticipatingClassroomsModal.tsx
import React from 'react';
import { Modal, Tabs, List, Button, message, Popconfirm, Row } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ClassroomSummary } from '../routes/($lang).home';
import { deleteClassroomById } from '../services/classroomService';

const { TabPane } = Tabs;

interface Props {
  visible: boolean;
  onClose: () => void;
  professorRooms: ClassroomSummary[];
  studentRooms: ClassroomSummary[];
  onRefetch?: () => void;
}

const ParticipatingClassroomsModal: React.FC<Props> = ({
  visible,
  onClose,
  professorRooms,
  studentRooms,
  onRefetch,
}) => {
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    navigate(`/classroom/${id}`);
    onClose();
  };

  const handleRemove = async (id: string, isProfessor: boolean) => {
    try {
      await deleteClassroomById(id);
      message.success(isProfessor ? 'Sala removida com sucesso' : 'Desmatriculado com sucesso');
      onRefetch?.();
    } catch {
      message.error('Erro ao tentar remover ou desmatricular');
    }
  };

  const renderRoom = (room: ClassroomSummary, isProfessor: boolean) => (
    <List.Item
      style={{
        cursor: 'pointer',
        transition: 'background 0.2s',
        paddingRight: 12,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      actions={[
        <Popconfirm
          key="confirm"
          title={
            isProfessor
              ? 'Tem certeza que deseja excluir esta sala? Todos os dados associados serão apagados.'
              : 'Deseja desmatricular-se desta sala?'
          }
          onConfirm={() => handleRemove(room.id, isProfessor)}
          okText="Sim"
          cancelText="Cancelar"
        >
          <Button danger type="primary">
            {isProfessor ? 'Remover' : 'Desmatricular'}
          </Button>
        </Popconfirm>,
      ]}
    >
      <div onClick={() => handleNavigate(room.id)} style={{ flex: 1 }}>
        <List.Item.Meta title={room.name} description={room.instructor} />
      </div>
    </List.Item>
  );

  return (
    <Modal
      title="Salas Participando"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Tabs
        defaultActiveKey="professor"
        tabBarExtraContent={
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefetch}
            size="small"
            style={{ marginRight: 16 }}
          >
            Atualizar
          </Button>
        }
      >
        <TabPane tab="Professor" key="professor">
          <List
            itemLayout="horizontal"
            dataSource={professorRooms}
            pagination={{ pageSize: 5, style: { display: 'flex', justifyContent: 'center' } }}
            renderItem={(room) => renderRoom(room, true)}
          />
        </TabPane>
        <TabPane tab="Aluno" key="aluno">
          <List
            itemLayout="horizontal"
            dataSource={studentRooms}
            pagination={{ pageSize: 5, style: { display: 'flex', justifyContent: 'center' } }}
            renderItem={(room) => renderRoom(room, false)}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ParticipatingClassroomsModal;
