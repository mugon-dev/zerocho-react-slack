import React, { useCallback, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { Link, Navigate } from 'react-router-dom';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import { Route, Routes } from 'react-router';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { IUser } from '@typings/db';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';

const Channel = loadable(() => import('@pages/channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Index = () => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false, false);
    });
  }, []);
  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);
  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal((prev) => !prev);
  }, []);
  const onCreateWorkspace = useCallback(() => {}, []);
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);
  // return 은 hooks 보다 아래에 있어야함
  if (!userData) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span onClick={onClickUserProfile}>
              <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            </span>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData &&
            userData.Workspaces.map((ws) => {
              return (
                <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                  <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                </Link>
              );
            })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
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
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Index;
