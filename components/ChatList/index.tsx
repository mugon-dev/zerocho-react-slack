import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { FC, useCallback, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import Chat from '@components/Chat';

interface Props {
  // isReachingEnd?: boolean;
  // isEmpty: boolean;
  chatSections: { [key: string]: IDM[] };
  // setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  // chatData: IDM[] | undefined;
}

const ChatList: FC<Props> = ({ chatSections }) => {
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
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
