// src/routes/classroom/ClassroomStudents.tsx

import React, { useState } from 'react';
import { Avatar, Button, List, Modal, Form, Input, message, Space } from 'antd';
import type { Student } from '../../services/enrollmentService';
import { inviteStudentToClassroom } from '../../services/enrollmentService';

interface ClassroomStudentsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classroomId: string;
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'regular':
      return {
        backgroundColor: '#d4edda',
        padding: '2px 6px',
        borderRadius: '4px',
        color: '#155724',
      };
    case 'pending':
      return {
        backgroundColor: '#fff3cd',
        padding: '2px 6px',
        borderRadius: '4px',
        color: '#856404',
      };
    case 'blocked':
      return {
        backgroundColor: '#f8d7da',
        padding: '2px 6px',
        borderRadius: '4px',
        color: '#721c24',
      };
    default:
      return {};
  }
}

const ClassroomStudents: React.FC<ClassroomStudentsProps> = ({
  students,
  setStudents,
  classroomId,
}) => {
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteForm] = Form.useForm();

  const handleInvite = async () => {
    try {
      const values = await inviteForm.validateFields();
      const email = values.email as string;

      console.log('Convidando aluno para classroomId =', classroomId);

      const result = await inviteStudentToClassroom(email, classroomId);

      const newStudent: Student = {
        studentId: '',
        enrollmentId: result.id,
        name: 'Pendente',
        email: email,
        picture: undefined,
        status: 'pending',
        isDelinquent: false,
      };
      setStudents([...students, newStudent]);
      inviteForm.resetFields();
      setIsInviteModalVisible(false);
      message.success('Convite enviado com sucesso');
    } catch (error: any) {
      message.error(error.message || 'Erro ao convidar aluno');
    }
  };

  const toggleDelinquentStatus = (enrollmentId: string) => {
    setStudents((prev) =>
      prev.map((stu) => {
        if (stu.enrollmentId === enrollmentId) {
          if (stu.status === 'regular') {
            return { ...stu, status: 'blocked', isDelinquent: true };
          } else if (stu.status === 'blocked') {
            return { ...stu, status: 'regular', isDelinquent: false };
          }
        }
        return stu;
      })
    );
  };

  const deleteStudentLocally = (enrollmentId: string) => {
    setStudents((prev) => prev.filter((stu) => stu.enrollmentId !== enrollmentId));
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button type="primary" onClick={() => setIsInviteModalVisible(true)}>
          Convidar Aluno
        </Button>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={students}
        locale={{ emptyText: 'Nenhum aluno encontrado' }}
        renderItem={(student) => (
          <List.Item
            key={student.enrollmentId}
            actions={[
              <Button
                type="link"
                onClick={() => toggleDelinquentStatus(student.enrollmentId)}
                disabled={student.status === 'pending'}
              >
                {student.isDelinquent ? 'Desbloquear' : 'Bloquear'}
              </Button>,
              <Button type="link" danger onClick={() => deleteStudentLocally(student.enrollmentId)}>
                Remover
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                student.picture ? (
                  <Avatar src={student.picture} />
                ) : (
                  <Avatar style={{ backgroundColor: '#87d068' }}>
                    {student.name.charAt(0)}
                  </Avatar>
                )
              }
              title={
                <Space direction="horizontal" size={8}>
                  {/*
                    Se o status for "pending", não exibimos o nome ("")
                    Senão, exibimos o nome normal
                  */}
                  {student.status !== 'pending' && (
                    <span style={{ fontWeight: '500' }}>{student.name}</span>
                  )}

                  {/* Exibimos sempre a TAG de status */}
                  {student.status === 'pending' ? (
                    <span style={getStatusStyle('pending')}>PENDENTE</span>
                  ) : student.isDelinquent ? (
                    <span style={getStatusStyle('blocked')}>INADIMPLENTE</span>
                  ) : (
                    <span style={getStatusStyle('regular')}>REGULAR</span>
                  )}
                </Space>
              }
              description={student.email}
            />
          </List.Item>
        )}
      />

      <Modal
        title="Convidar Aluno"
        open={isInviteModalVisible}
        onOk={handleInvite}
        onCancel={() => setIsInviteModalVisible(false)}
        okText="Convidar"
      >
        <Form form={inviteForm} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Por favor, insira o email do aluno' },
              { type: 'email', message: 'Email inválido' },
            ]}
          >
            <Input placeholder="exemplo@dominio.com" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ClassroomStudents;