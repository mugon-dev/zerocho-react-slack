import React from 'react';

type Props = {
  children?: React.ReactNode;
  show: boolean;
  onCloseModal: () => void;
};
const Modal: React.FC<Props> = ({ show, children, onCloseModal }: Props) => {
  return (
    <div>
      <div>modal</div>
    </div>
  );
};

export default Modal;
