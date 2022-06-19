import { ChatZone } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { FC, useCallback, useRef } from 'react';
import Chat from '@components/Chat';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
  // isReachingEnd?: boolean;
  // isEmpty: boolean;
  // chatSections: { [key: string]: (IDM | IChat)[] };
  // setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  chatData: IDM[] | undefined;
}

const ChatList: FC<Props> = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  // const onScroll = useCallback(
  //   (values) => {
  //     if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
  //       setSize((size) => size + 1).then(() => {
  //         scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
  //       });
  //     }
  //   },
  //   [setSize, scrollbarRef, isReachingEnd, isEmpty],
  // );

  return (
    <ChatZone>
      <Scrollbars autoHide={true} ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData &&
          chatData?.map((chat) => {
            return <Chat key={chat.id} data={chat} />;
          })}
      </Scrollbars>
      {/*<Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>*/}
      {/*  {Object.entries(chatSections).map(([date, chats]) => {*/}
      {/*    return (*/}
      {/*      <Section className={`section-${date}`} key={date}>*/}
      {/*        <StickyHeader>*/}
      {/*          <button>{date}</button>*/}
      {/*        </StickyHeader>*/}
      {/*        {chats.map((chat) => (*/}
      {/*          <Chat key={chat.id} data={chat} />*/}
      {/*        ))}*/}
      {/*      </Section>*/}
      {/*    );*/}
      {/*  })}*/}
      {/*</Scrollbars>*/}
    </ChatZone>
  );
};

export default ChatList;
