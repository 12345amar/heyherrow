import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import './index.scss';
import Loader from '../common/Loader';
import ChatMessageGroup from '../common/ChatMessageGroup';
import ChatMessageItem from '../common/ChatMessageItem';

const MessageList = () => {
  const { loading, data } = useSelector((state) => state.chat.chatMessages);
  const chatMessageList = useRef();
  const { currentUser } = useSelector((state) => state.auth);
  const { groupId } = useParams();

  useEffect(() => {
    chatMessageList.current.scrollTop = chatMessageList.current.scrollHeight;
  }, [data]);

  return (
    <>
      {loading
        ? (
          <div className="chat-message-list">
            <Loader secondary />
          </div>
        )
        : (
          <div
            className="chat-message-list"
            ref={chatMessageList}
          >
            {Object.keys(data).reverse()
              .filter((key) => data[key].length).map((key) => (
                <ChatMessageGroup date={key}>
                  {data[key].map((chat) => (
                    <ChatMessageItem
                      message={chat.message}
                      assets={chat.chatAssets}
                      type={Number(currentUser.id) === Number(chat.fromUserId) && 'sent'}
                      key={chat.chatId}
                      date={chat.created_at}
                      profile={chat.fromUser || chat.fromCustomer}
                      group={!!groupId}
                    />
                  ))}
                </ChatMessageGroup>
              ))}
          </div>
        )}
    </>
  );
};

export default MessageList;
