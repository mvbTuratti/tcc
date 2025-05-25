import React, { useState } from 'react';
import { Button, List, Modal, Form, Input } from 'antd';
import type { Student } from './types';

interface ClassroomStudentsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "regular":
      return { backgroundColor: "#d4edda", padding: "2px 6px", borderRadius: "4px", color: "#155724" };
    case "pending":
      return { backgroundColor: "#fff3cd", padding: "2px 6px", borderRadius: "4px", color: "#856404" };
    case "blocked":
      return { backgroundColor: "#f8d7da", padding: "2px 6px", borderRadius: "4px", color: "#721c24" };
    default:
      return {};
  }
}

const ClassroomStudents: React.FC<ClassroomStudentsProps> = ({ students, setStudents }) => {
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteForm] = Form.useForm();

  // Convidar novo aluno
  const handleInvite = () => {
    inviteForm.validateFields().then(values => {
      const newStudent: Student = {
        id: Date.now(),
        name: "Pendente",
        email: values.email,
        status: "pending"
      };
      setStudents([...students, newStudent]);
      inviteForm.resetFields();
      setIsInviteModalVisible(false);
    });
  };

  // Bloquear ou desbloquear
  const toggleBlockStudent = (id: number) => {
    setStudents(students.map(student => {
      if (student.id === id) {
        if (student.status === "regular") {
          return { ...student, status: "blocked" };
        } else if (student.status === "blocked") {
          return { ...student, status: "regular" };
        }
      }
      return student;
    }));
  };

  // Excluir aluno
  const deleteStudent = (id: number) => {
    setStudents(students.filter(student => student.id !== id));
  };

  return (
    <>
      {/* Botão centralizado para convidar aluno */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button type="primary" onClick={() => setIsInviteModalVisible(true)}>
          Convidar Aluno
        </Button>
      </div>

      {/* Lista de alunos */}
      <List
        itemLayout="horizontal"
        dataSource={students}
        renderItem={(student) => (
          <List.Item
            key={student.id}
            actions={[
              <Button
                type="link"
                onClick={() => toggleBlockStudent(student.id)}
                disabled={student.status === "pending"}
              >
                {student.status === "regular" ? "Bloquear" : "Desbloquear"}
              </Button>,
              <Button type="link" danger onClick={() => deleteStudent(student.id)}>
                Excluir
              </Button>
            ]}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <List.Item.Meta
              title={student.name}
              description={student.email}
            />
            <div style={{ ...getStatusStyle(student.status), display: 'flex', alignItems: 'center' }}>
              {student.status.toUpperCase()}
            </div>
          </List.Item>
        )}
      />

      {/* Modal para convidar aluno */}
      <Modal
        title="Convidar Aluno"
        visible={isInviteModalVisible}
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
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input placeholder="Email do aluno" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ClassroomStudents;
