import React from 'react';
import { Modal, Tabs, List } from 'antd';
import type { ClassroomSummary } from '../routes/($lang).home';

const { TabPane } = Tabs;

interface Props {
  visible: boolean;
  onClose: () => void;
  professorRooms: ClassroomSummary[];
  studentRooms: ClassroomSummary[];
}

const ParticipatingClassroomsModal: React.FC<Props> = ({
  visible,
  onClose,
  professorRooms,
  studentRooms,
}) => {
  return (
    <Modal
      title="Salas Participando"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Tabs defaultActiveKey="professor">
        <TabPane tab="Professor" key="professor">
          <List
            itemLayout="horizontal"
            dataSource={professorRooms}
            pagination={{ pageSize: 5, style: { display: 'flex', justifyContent: 'center' } }}
            renderItem={(room) => (
              <List.Item>
                <List.Item.Meta
                  title={room.name}
                  description={room.instructor}
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Aluno" key="aluno">
          <List
            itemLayout="horizontal"
            dataSource={studentRooms}
            pagination={{ pageSize: 5, style: { display: 'flex', justifyContent: 'center' } }}
            renderItem={(room) => (
              <List.Item>
                <List.Item.Meta
                  title={room.name}
                  description={room.instructor}
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ParticipatingClassroomsModal;
