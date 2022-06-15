import React, { CSSProperties, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from '@components/Menu/styles';

type Props = {
  children?: React.ReactNode;
  show: boolean;
  onCloseModal: (e: React.MouseEvent<HTMLElement>) => void;
  style: CSSProperties;
  closeButton?: boolean;
};
const Menu: React.FC<Props> = ({ closeButton, style, show, children, onCloseModal }: Props) => {
  // 부모 영역을 눌렀을땐 내가 닫히게
  // 나를 눌렀을땐 내가 안닫히게
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  }, []);
  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};
export default Menu;
