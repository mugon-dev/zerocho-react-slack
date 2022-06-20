import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { forwardRef, MutableRefObject, useCallback } from 'react';
import Scrollbars, { positionValues } from 'react-custom-scrollbars';
import Chat from '@components/Chat';

interface Props {
  isReachingEnd: boolean;
  isEmpty: boolean;
  chatSections: { [key: string]: IDM[] };
  setSize: (size: number | ((_size: number) => number)) => Promise<IDM[][] | undefined>;
  // chatData: IDM[] | undefined;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }: Props, ref) => {
  // 채팅을 하고 엔터를 쳤을때 스크롤 포지션을 가장 아래로 내리기 위해 부모 컴포넌트로 올림 => forwardRef 사용
  // const scrollbarRef = useRef(null);
  const onScroll = useCallback(
    (values: positionValues) => {
      if (values.scrollTop === 0 && !isReachingEnd) {
        console.log('가장 위');
        // 데이터 추가 로딩
        setSize((prevSize) => prevSize + 1)?.then(() => {
          // 스크롤 위치 유지
          const current = (ref as MutableRefObject<Scrollbars>)?.current;
          if (current) {
            current.scrollTop(current.getScrollHeight() - values.scrollHeight);
          }
        });
      }
    },
    [setSize],
  );
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
      <Scrollbars autoHide={true} ref={ref} onScrollFrame={onScroll}>
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
});

export default ChatList;
