import { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I\'m DisasterGuard\'s AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock response function - in a real app, this would call an AI API
  const getResponse = (message) => {
    // Simplified responses based on keywords
    const lowerCaseMessage = message.toLowerCase();
    let botResponse = '';

    if (lowerCaseMessage.includes('earthquake')) {
      botResponse = 'During an earthquake: DROP to the ground, COVER your head and neck, and HOLD ON until the shaking stops. If indoors, stay away from windows. If outdoors, move to an open area away from buildings and power lines.';
    } else if (lowerCaseMessage.includes('flood')) {
      botResponse = 'In a flood situation, move to higher ground immediately. Do not walk, swim, or drive through flood waters. Just 6 inches of moving water can knock you down, and one foot of water can sweep your vehicle away.';
    } else if (lowerCaseMessage.includes('fire')) {
      botResponse = 'If there\'s a fire, evacuate immediately. If smoke is present, stay low to the ground. Test doorknobs and spaces around doors before opening them. If a door is warm, use an alternate escape route.';
    } else if (lowerCaseMessage.includes('hurricane') || lowerCaseMessage.includes('tornado')) {
      botResponse = 'For hurricanes and tornados, seek shelter in a basement or an interior room away from windows. Have emergency supplies ready and follow evacuation orders from local officials.';
    } else if (lowerCaseMessage.includes('emergency kit') || lowerCaseMessage.includes('supplies')) {
      botResponse = 'Your emergency kit should include: water (one gallon per person per day), non-perishable food, medications, flashlight, batteries, first aid kit, whistle, dust mask, plastic sheeting and duct tape, moist towelettes, garbage bags, wrench or pliers, can opener, local maps, and a cell phone with chargers.';
    } else if (lowerCaseMessage.includes('evacuation') || lowerCaseMessage.includes('evacuate')) {
      botResponse = 'When evacuating: secure your home, take your emergency kit, follow recommended evacuation routes, keep a full tank of gas, and have a communication plan with your family. Listen to local authorities for specific instructions.';
    } else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('assistance')) {
      botResponse = 'I can provide information on disaster preparedness, emergency procedures, and safety tips. Feel free to ask specific questions about earthquakes, floods, fires, hurricanes, tornados, evacuation plans, or emergency kits.';
    } else {
      botResponse = 'I\'m here to help with disaster-related questions. You can ask about specific emergencies like earthquakes, floods, fires, hurricanes, or tornados. Or ask about evacuation procedures and emergency supplies.';
    }

    return botResponse;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = {
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        text: getResponse(inputText),
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-300">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3">
            <h3 className="text-lg font-medium flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              DisasterGuard AI Assistant
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-50">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span
                      className={`text-xs block mt-1 ${
                        message.sender === 'user'
                          ? 'text-blue-200'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none max-w-xs lg:max-w-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="border-t border-gray-300 p-2">
            <div className="flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="ml-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;