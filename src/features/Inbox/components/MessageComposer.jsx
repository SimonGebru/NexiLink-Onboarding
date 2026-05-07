import React, { useState } from 'react';

export default function MessageComposer({ disabled, onSendMessage }) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputText.trim() === '') return;

    onSendMessage(inputText);
    
    setInputText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input 
        type="text" 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Skriv ett meddelande..." 
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      />
      <button 
        type="submit"
        className={`px-6 py-2 rounded-lg font-semibold ${
          disabled || inputText.trim() === ''
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        disabled={disabled || inputText.trim() === ''}
      >
        Skicka
      </button>
    </form>
  );
}