// useWebSocket.js
import { useEffect, useState } from 'react';
import websocketService from '../services/webSocketService';
import { useSelector } from 'react-redux';

export function useWebSocket(messageType) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(websocketService.isConnected);
  const { token } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (token) {
      // Connect to WebSocket
      websocketService.connect(token);
      
      // Add message listeners
      const messageCallback = (data) => {
        setMessages(prev => [...prev, data.message]);
      };
      
      const connectCallback = () => {
        setIsConnected(true);
      };
      
      const disconnectCallback = () => {
        setIsConnected(false);
      };
      
      websocketService.addCallbacks(messageType, messageCallback);
      websocketService.addCallbacks('connect', connectCallback);
      websocketService.addCallbacks('disconnect', disconnectCallback);

      // Cleanup
      return () => {
        websocketService.removeCallbacks(messageType, messageCallback);
        websocketService.removeCallbacks('connect', connectCallback);
        websocketService.removeCallbacks('disconnect', disconnectCallback);
      };
    }
  }, [messageType, token]);
  
  return {
    messages,
    isConnected,
  };
}