import React, { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import fetcher from '@utils/fetcher';
import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import { IDM } from '@typings/db';
import axios from 'axios';
import ChatList from '@components/ChatList';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const PAGE_SIZE = 20;
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );
  // infinity scroll 데이터
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE) || false;
  const [chat, onChangeChat, setChat] = useInput<string>('');
  const scrollbarRef = useRef<Scrollbars>(null);
  const onSubmitForm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // optimistic ui 적용
      if (chat?.trim() && chatData) {
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: chat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, { content: chat })
          .then((response) => {
            mutateChat();
          })
          .catch(console.error);
      }
    },
    [chat, chatData, mutateChat, workspace, id, myData, userData, setChat],
  );
  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData?.length]);
  // chatData.reverse() => 기존 배열이 바뀌는 문제 발생
  // immutable 하게 바꾸기
  // [].concat(...chatData).reverse() or
  // [...chatData].reverse()
  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);
  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder={''} />
    </Container>
  );
};

export default DirectMessage;
