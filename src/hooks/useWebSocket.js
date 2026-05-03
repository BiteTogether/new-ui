// useWebSocket.js
import { useEffect, useState } from 'react';
import websocketService from '../services/webSocketService';
import { useSelector, useDispatch } from 'react-redux';
import { setLocations } from '../store/chat/chatSlice';

export function useWebSocket(messageType) {
  const [messages, setMessages] = useState([]);
  const [votes, setVotes] = useState([]);
  const [bills, setBills] = useState([]);
  const [isConnected, setIsConnected] = useState(websocketService.isConnected);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      // Connect to WebSocket
      websocketService.connect(token);
      
      // Add message listeners
      const messageCallback = (data) => {
        setMessages(prev => [...prev, data.message]);
      };

      // Add vote listeners
      const voteCallback = (data) => {
        switch (data.eventType) {
          case "VOTE_CREATED":
            setVotes(prev => [...prev, data.voteSession]);
            break;
          case "VOTE_CAST":
            setVotes(prev => {
              const idx = prev.findIndex(v => v.id === data.voteSession.id);
              if (idx !== -1) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], ...data.voteSession };
                return updated;
              } else {
                return [...prev, data.voteSession];
              }
            });
            break;
          case "VOTE_CLOSED":
            setVotes(prev => {
              const idx = prev.findIndex(v => v.id === data.voteSession.id);
              if (idx !== -1) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], ...data.voteSession };
                return updated;
              } else {
                return [...prev, data.voteSession];
              }
            });
            break;
          default:
            break;
        }
      };

      const locationCallback = (data) => {
        const nextLocation = data.location;
        if (!nextLocation) return;

        dispatch(setLocations([nextLocation]));
      };

      const billCallback = (data) => {
        switch (data.eventType) {
          case "BILL_CREATED":
          case "BILL_FINALIZED":
          case "BILL_PAYMENT_UPDATED":
          case "BILL_SETTLED": {
            const nextBill = data.billSession;
            if (!nextBill) return;
            setBills((prev) => {
              const idx = prev.findIndex((b) => b.id === nextBill.id);
              if (idx !== -1) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], ...nextBill };
                return updated;
              }
              return [...prev, nextBill];
            });
            break;
          }
          default:
            break;
        }
      };
        
      const connectCallback = () => {
        setIsConnected(true);
      };
      
      const disconnectCallback = () => {
        setIsConnected(false);
      };
      
      websocketService.addCallbacks(messageType, messageCallback);
      websocketService.addCallbacks(messageType, voteCallback);
      websocketService.addCallbacks(messageType, billCallback);
      websocketService.addCallbacks(messageType, locationCallback);
      websocketService.addCallbacks('connect', connectCallback);
      websocketService.addCallbacks('disconnect', disconnectCallback);

      // Cleanup
      return () => {
        websocketService.removeCallbacks(messageType, messageCallback);
        websocketService.removeCallbacks(messageType, voteCallback);
        websocketService.removeCallbacks(messageType, billCallback);
        websocketService.removeCallbacks(messageType, locationCallback);
        websocketService.removeCallbacks('connect', connectCallback);
        websocketService.removeCallbacks('disconnect', disconnectCallback);
      };
    }
  }, [messageType, token]);

  const sendLocation = ({
    conversationId,
    location,
    isSharing = true,
  }) => {
    if (!websocketService.isConnected) return false;

    if (!conversationId || !location) return false;

    const payload = {
      conversationId,
      action: "LOCATION_UPDATE",
      location: {
        lat: location.latitude,
        lng: location.longitude,
      },
      isSharing,
    };

    return websocketService.sendMessage(payload);
  };
  
  return {
    messages,
    votes,
    bills,
    isConnected,
    sendLocation,
  };
}