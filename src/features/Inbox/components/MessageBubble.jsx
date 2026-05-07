export default function MessageBubble({ text, time, isOwnMessage }) {
  return (
    <div
      className={`flex w-full mb-4 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 ${
          isOwnMessage
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        <p>{text}</p>
        <span
          className={`text-xs block mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}
        >
          {time}
        </span>
      </div>
    </div>
  );
}
