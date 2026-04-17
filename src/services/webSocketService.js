// websocketService.js
import Config from "react-native-config";
class WebSocketService {
  static instance = null;
  callbacks = {};

  
  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  
  constructor() {
    this.socketRef = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  
  connect(token) {
    if (this.socketRef) {
      return;
    }

    const wsUrl = `${Config.CHAT_SOCKET_URL}?jwt=${token}`;
    this.socketRef = new WebSocket(wsUrl, ['jwt']);

    
    this.socketRef.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;

      
      // Trigger callback
      this.executeCallback('connect', null);
    };

    
    this.socketRef.onmessage = (e) => {
      const data = JSON.parse(e.data);
      this.executeCallback(data.action, data);
    };

    
    this.socketRef.onerror = (e) => {
      console.error('WebSocket error:', e);
      this.executeCallback('error', e);
    };

    
    this.socketRef.onclose = (e) => {
      console.log('WebSocket closed:', e.code, e.reason);
      this.isConnected = false;
      this.socketRef = null;

      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        // Exponential backoff for reconnection
        const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
        this.timeout = setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(token);
        }, delay);
      }
    };
  }

  
  disconnect() {
    if (this.socketRef) {
      this.socketRef.close();
      this.socketRef = null;
      this.isConnected = false;
      clearTimeout(this.timeout);
    }
  }

  
  sendMessage(data) {
    if (this.socketRef && this.isConnected) {
      this.socketRef.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  
  addCallbacks(messageType, callback) {
    if (!this.callbacks[messageType]) {
      this.callbacks[messageType] = [];
    }
    this.callbacks[messageType].push(callback);
  }

  
  removeCallbacks(messageType, callback) {
    if (this.callbacks[messageType]) {
      this.callbacks[messageType] = this.callbacks[messageType]
        .filter(cb => cb !== callback);
    }
  }

  
  executeCallback(messageType, data) {
    if (this.callbacks[messageType]) {
      this.callbacks[messageType].forEach(callback => callback(data));
    }
  }
}


export default WebSocketService.getInstance();