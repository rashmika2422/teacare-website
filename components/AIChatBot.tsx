'use client';
import { useState, useEffect, useRef } from 'react';

type Message = { id: string; sender: 'bot' | 'user'; text: string; actionLink?: string; actionText?: string };

const INITIAL_MESSAGE: Message = {
  id: 'init',
  sender: 'bot',
  text: 'Hello! I am your Teacare Services Pvt Ltd Virtual Concierge. How can I assist you in planning your corporate event today?'
};

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setHasUnread(false);
  };

  const simulateBotResponse = (userText: string) => {
    setIsTyping(true);
    setTimeout(() => {
      let botResponse: Message;

      if (userText.includes('Appointment')) {
        botResponse = {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'Excellent. Our executive planners are ready to meet with you. Please use our booking calendar to secure a consultation slot.',
          actionLink: '#appointment',
          actionText: 'Go to Booking Calendar'
        };
      } else if (userText.includes('Estimate')) {
        botResponse = {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'You can instantly build your event package and see aesthetic previews using our Interactive Event Planner.',
          actionLink: '#estimator',
          actionText: 'Open Event Planner'
        };
      } else if (userText.includes('Services')) {
        botResponse = {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'We specialize in Executive High Teas, Corporate Buffets, and Summit Productions. Explore our portfolio below.',
          actionLink: '#services',
          actionText: 'View Our Services'
        };
      } else {
        botResponse = {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'I can connect you directly with our headquarters for personalized assistance.',
          actionLink: '/contact',
          actionText: 'Go to Contact Portal'
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickReply = (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    simulateBotResponse(text);
  };

  const executeAction = (link: string) => {
    if (link.startsWith('#')) {
      const el = document.querySelector(link);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth < 768) setIsOpen(false); // Close on mobile after clicking
      } else {
        // If not on homepage, redirect to homepage with hash
        window.location.href = `/${link}`;
      }
    } else {
      window.location.href = link;
    }
  };

  return (
    <>
      <button
        className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        aria-label="Toggle AI Concierge"
      >
        {isOpen ? <i className="fa-solid fa-xmark" /> : <i className="fa-solid fa-message" />}
        {!isOpen && hasUnread && <span className="chatbot-unread-dot" />}
      </button>

      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-avatar">
            <i className="fa-solid fa-robot" />
          </div>
          <div className="chatbot-header-text">
            <h4>Teacare Services Pvt Ltd Concierge</h4>
            <span className="status">● Online</span>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
              <p>{msg.text}</p>
              {msg.actionLink && msg.actionText && (
                <button
                  className="chat-action-btn"
                  onClick={() => executeAction(msg.actionLink!)}
                >
                  {msg.actionText} <i className="fa-solid fa-arrow-right" />
                </button>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-bubble bot typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-quick-replies">
          <button onClick={() => handleQuickReply('I want to Book an Appointment')}>Book Appointment</button>
          <button onClick={() => handleQuickReply('I need a Cost Estimate')}>Get an Estimate</button>
          <button onClick={() => handleQuickReply('What Services do you offer?')}>View Services</button>
          <button onClick={() => handleQuickReply('I want to Contact a Human')}>Contact a Human</button>
        </div>
      </div>
    </>
  );
}
