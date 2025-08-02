import { useState, useEffect, useRef } from "react";
import { chatService, userService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { socketService } from "../services/socket";
import { Send, Users } from "lucide-react";
import "./Chat.css";

const Chat = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch user connections on component mount
  useEffect(() => {
    fetchConnections();

    // Connect to socket
    socketService.connect();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle incoming messages
  useEffect(() => {
    if (selectedUser) {
      socketService.onMessageReceived((messageData) => {
        setMessages((prev) => [
          ...prev,
          {
            senderId: {
              firstName: messageData.firstName,
              lastName: messageData.lastName,
            },
            text: messageData.text,
            createdAt: new Date(),
          },
        ]);
      });

      // Join chat room
      socketService.joinChat(user.firstName, user._id, selectedUser._id);
    }

    return () => {
      socketService.offMessageReceived();
    };
  }, [selectedUser, user]);

  const fetchConnections = async () => {
    try {
      const response = await userService.getConnections();
      setConnections(response.data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const selectUser = async (targetUser) => {
    setSelectedUser(targetUser);
    setLoading(true);
    try {
      const chatData = await chatService.getMessages(targetUser._id);
      setMessages(chatData.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user._id,
      targetUserId: selectedUser._id,
      text: newMessage.trim(),
    };

    // Add message to local state immediately
    setMessages((prev) => [
      ...prev,
      {
        senderId: { firstName: user.firstName, lastName: user.lastName },
        text: newMessage.trim(),
        createdAt: new Date(),
      },
    ]);

    // Send via socket
    socketService.sendMessage(messageData);

    setNewMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <Users size={20} />
          <h3>Connections</h3>
        </div>
        <div className="connections-list">
          {connections.length === 0 ? (
            <p className="no-connections">No connections yet</p>
          ) : (
            connections.map((connection) => (
              <div
                key={connection._id}
                className={`connection-item ${
                  selectedUser?._id === connection._id ? "active" : ""
                }`}
                onClick={() => selectUser(connection)}
              >
                <img
                  src={connection.photoUrl || "https://via.placeholder.com/40"}
                  alt={connection.firstName}
                  className="connection-avatar"
                />
                <div className="connection-info">
                  <span className="connection-name">
                    {connection.firstName} {connection.lastName}
                  </span>
                  {connection.about && (
                    <span className="connection-about">{connection.about}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <img
                src={selectedUser.photoUrl || "https://via.placeholder.com/40"}
                alt={selectedUser.firstName}
                className="chat-user-avatar"
              />
              <div className="chat-user-info">
                <h3>
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                {selectedUser.about && <span>{selectedUser.about}</span>}
              </div>
            </div>

            <div className="chat-messages">
              {loading ? (
                <div className="loading">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="no-messages">
                  Start your conversation with {selectedUser.firstName}!
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwnMessage =
                    message.senderId?.firstName === user.firstName;
                  return (
                    <div
                      key={index}
                      className={`message ${isOwnMessage ? "own" : "other"}`}
                    >
                      <div className="message-content">
                        {!isOwnMessage && (
                          <span className="sender-name">
                            {message.senderId?.firstName}
                          </span>
                        )}
                        <p className="message-text">{message.text}</p>
                        <span className="message-time">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${selectedUser.firstName}...`}
                className="message-input"
              />
              <button
                type="submit"
                className="send-button"
                disabled={!newMessage.trim()}
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <Users size={64} />
            <h3>Select a connection to start chatting</h3>
            <p>
              Choose from your connections on the left to begin a conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
