import React, { useCallback } from 'react';
import { CloseModalButton, CreateModal } from '@components/Modal/styles';

type Props = {
  children?: React.ReactNode;
  show: boolean;
  onCloseModal: () => void;
};
const Modal: React.FC<Props> = ({ show, children, onCloseModal }: Props) => {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
