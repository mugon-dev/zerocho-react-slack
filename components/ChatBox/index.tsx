import React, { ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import { Mention } from 'react-mentions';
import { IUser } from '@typings/db';
import autosize from 'autosize';

interface Props {
  onSubmitForm: (e: React.FormEvent<HTMLFormElement>) => void;
  chat?: string;
  onChangeChat: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  data?: IUser[];
}

const ChatBox = ({ onSubmitForm, chat, onChangeChat, placeholder, data }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  });
  const onKeydownChat = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) onSubmitForm(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    },
    [onSubmitForm],
  );
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={(event) => onChangeChat(event as unknown as ChangeEvent<HTMLInputElement>)}
          onKeyPress={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={data?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            // renderSuggestion={renderUserSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
