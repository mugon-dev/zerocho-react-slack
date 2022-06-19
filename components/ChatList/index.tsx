import { ChatZone } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { FC } from 'react';
import Chat from '@components/Chat';

interface Props {
  // isReachingEnd?: boolean;
  // isEmpty: boolean;
  // chatSections: { [key: string]: (IDM | IChat)[] };
  // setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  chatData: IDM[] | undefined;
}

const ChatList: FC<Props> = ({ chatData }) => {
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
      {chatData?.map((chat) => {
        return <Chat key={chat.id} data={chat} />;
      })}
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
