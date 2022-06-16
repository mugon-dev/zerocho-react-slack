import React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/members/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/workspaces/${workspace}/members/${id}`, fetcher);

  if (!userData) {
    return null;
  }
  return (
    <div>
      <div>DirectMessage</div>
    </div>
  );
};

export default DirectMessage;
