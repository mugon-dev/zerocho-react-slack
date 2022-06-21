import { ChatWrapper } from '@components/Chat/styles';
import { IChat, IDM } from '@typings/db';
import React, { FC, memo, useMemo } from 'react';
import gravatar from 'gravatar';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';

interface Props {
  data: IDM | IChat;
}

const Chat: FC<Props> = ({ data }) => {
  const backUrl = 'http://192.168.0.117:3030';
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const user = 'Sender' in data ? data.Sender : data.User;
  // @[username](id)
  const result = useMemo(
    () =>
      data.content.startsWith('uploads/') ? (
        <img src={`${backUrl}/${data.content}`} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          input: data.content,
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
            if (arr) {
              return (
                <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                  @{arr[1]}
                </Link>
              );
            }
            return <br key={index} />;
          },
        })
      ),
    [data.content, workspace],
  );
  // const result = useMemo(
  //   () =>
  //     // uploads\\서버주소
  //     data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
  //       <img src={`api/${data.content}`} style={{ maxHeight: 200 }} />
  //     ) : (
  //       regexifyString({
  //         input: data.content,
  //         pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
  //         decorator(match, index) {
  //           const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
  //           if (arr) {
  //             return (
  //               <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
  //                 @{arr[1]}
  //               </Link>
  //             );
  //           }
  //           return <br key={index} />;
  //         },
  //       })
  //     ),
  //   [workspace, data.content],
  // );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
