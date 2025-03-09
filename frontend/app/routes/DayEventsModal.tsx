import React from 'react';
import { Modal, Button } from 'antd';
import type { Dayjs } from 'dayjs';

interface Props {
  visible: boolean;
  date: Dayjs | null;
  onClose: () => void;
}

const DayEventsModal: React.FC<Props> = ({ visible, date, onClose }) => {
  return (
    <Modal title="Eventos do dia" visible={visible} onCancel={onClose} footer={[<Button key="close" onClick={onClose}>Fechar</Button>]}>
      {date ? (
        <p>Mostrando eventos para o dia: {date.format('DD/MM/YYYY')}</p>
      ) : (
        <p>Nenhum dia selecionado.</p>
      )}
    </Modal>
  );
};

export default DayEventsModal;
