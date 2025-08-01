import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io("http://localhost:7777", {
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to server");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinChat(firstName, userId, targetUserId) {
    if (this.socket) {
      this.socket.emit("joinChat", { firstName, userId, targetUserId });
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit("sendMessage", messageData);
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on("messageReceived", callback);
    }
  }

  offMessageReceived() {
    if (this.socket) {
      this.socket.off("messageReceived");
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

export const socketService = new SocketService();
