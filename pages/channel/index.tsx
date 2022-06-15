import React from 'react';
import { Container, Header } from '@pages/channel/styles';

const Channel = () => {
  return (
    <Container>
      <Header>
        <span>#channel</span>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <span>channelMembersData?.length</span>
          <button
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
    </Container>
  );
};

export default Channel;
