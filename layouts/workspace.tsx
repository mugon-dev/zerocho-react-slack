import React, { useCallback } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { Navigate } from 'react-router-dom';

type Props = {
  children?: React.ReactNode;
};
const Workspace: React.FC<Props> = ({ children }: Props) => {
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false, false);
    });
  }, []);

  // return 은 hooks 보다 아래에 있어야함
  if (!data) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
