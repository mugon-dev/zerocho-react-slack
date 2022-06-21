import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import useSocket from '@hooks/useSocket';
import { DragOver } from '@pages/channel/styles';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const [socket] = useSocket(workspace);
  const PAGE_SIZE = 20;
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );
  const [dragOver, setDragOver] = useState(false);
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

  const onMessage = useCallback(
    (data: IDM) => {
      // id는 상대방 id
      // 상대방의 새 메시지만 새로가져옴
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            // 내가 스크롤바를 150 px이상 올렸을땐 바텀으로 스크롤을 바텀으로 안보냄 150px 이하면 스크롤 바를 바텀으로 이동
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              console.log('scrollToBottom', scrollbarRef.current?.getValues());
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 50);
            }
          }
        });
      }
    },
    [id, mutateChat, myData.id],
  );
  // socket 연결
  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [onMessage, socket]);
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      console.log(e);
      const formData = new FormData();
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            if (file) {
              console.log('... file[' + i + '].name = ' + file.name);
              formData.append('image', file);
            }
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
        setDragOver(false);
        mutateChat();
      });
    },
    [workspace, id],
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(e);
    setDragOver(true);
  }, []);
  // chatData.reverse() => 기존 배열이 바뀌는 문제 발생
  // immutable 하게 바꾸기
  // [].concat(...chatData).reverse() or
  // [...chatData].reverse()
  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);
  if (!userData || !myData) {
    return null;
  }
  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
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
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  );
};

export default DirectMessage;
