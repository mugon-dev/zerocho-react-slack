import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, DragOver, Header } from '@pages/channel/styles';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import useSocket from '@hooks/useSocket';
import useSWRInfinite from 'swr/infinite';
import { IChannel, IChat, IUser } from '@typings/db';
import useInput from '@hooks/useInput';
import Scrollbars from 'react-custom-scrollbars';
import axios from 'axios';
import makeSection from '@utils/makeSection';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import InviteChannelModal from '@components/InviteChannelModal';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const [socket] = useSocket(workspace);
  const PAGE_SIZE = 20;
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );
  const { data: channelMemberData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
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
      if (chat?.trim() && chatData && channelData) {
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: chat,
            UserId: myData.id,
            User: myData,
            ChannelId: channelData.id,
            Channel: channelData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
          localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
        });
        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, { content: chat })
          .then((response) => {
            mutateChat();
          })
          .catch(console.error);
      }
    },
    [chat, chatData, channelData, mutateChat, workspace, channel, myData, setChat],
  );
  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData?.length]);

  // 채널 들어왔을때 시간 업데이트 안 읽은 메세지 수 기준용
  useEffect(() => {
    localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
  }, [channel, workspace]);

  const onMessage = useCallback(
    (data: IChat) => {
      // id는 상대방 id
      // 상대방의 새 메시지만 새로가져옴
      if ((data.Channel.name === channel && data.content.startsWith('uploads\\')) || data.UserId !== myData?.id) {
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
    [channel, mutateChat, myData],
  );
  // socket 연결
  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [onMessage, socket]);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const formData = new FormData();
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // if dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            if (file) formData.append('image', file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData).then(() => {
        setDragOver(false);
        localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
      });
    },
    [channel, workspace],
  );
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  // chatData.reverse() => 기존 배열이 바뀌는 문제 발생
  // immutable 하게 바꾸기
  // [].concat(...chatData).reverse() or
  // [...chatData].reverse()
  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);

  if (!myData) {
    return null;
  }
  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <span>#{channel}</span>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <span>{channelMemberData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        setSize={setSize}
        isReachingEnd={isReachingEnd}
        isEmpty
      />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder={''} />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  );
};

export default Channel;
