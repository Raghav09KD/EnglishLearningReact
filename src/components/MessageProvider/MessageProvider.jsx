
// components/MessageProvider.jsx
import React, { createContext, useContext } from 'react';
import { message } from 'antd';

const MessageContext = createContext(null);

export const useGlobalMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};
