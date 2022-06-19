import io, { Socket } from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://loaclhost:3030';
const sockets: { [key: string]: Socket } = {};
const useSocket = (workspace?: string) => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!workspace) {
    return [undefined, disconnect];
  }
  sockets[workspace] = io(`${backUrl}/${workspace}`);

  return [sockets[workspace], disconnect];
};
export default useSocket;
