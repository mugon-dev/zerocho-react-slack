import React, { useCallback } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { Navigate } from 'react-router-dom';
import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import { Route, Routes } from 'react-router';
import loadable from '@loadable/component';

const Channel = loadable(() => import('@pages/channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Index = () => {
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
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>MenuScroll</MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path={'/workspace/channel'} element={<Channel />} />
            <Route path={'/workspace/dm'} element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Index;
