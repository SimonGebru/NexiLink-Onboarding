export const mockConversations = [
  {
    id: "1",
    name: "Student",
    lastMessage: "Ha de gött!",
    messages: [
      {
        id: "m1",
        text: "Hej, hur går det?",
        sender: "me",
        time: "09:30",
      },
      {
        id: "m2",
        text: "Det går bra!",
        sender: "them",
        time: "09:35",
      },
      {
        id: "m3",
        text: "Redo för nästa",
        sender: "them",
        time: "10:00",
      },
    ],
  },
  {
    id: "2",
    name: "Employee",
    lastMessage: "Det är bara att komma",
    messages: [
      { id: "m4", text: "Tjenare", sender: "me", time: "Igår" },
      {
        id: "m5",
        text: "Hallå!",
        sender: "them",
        time: "Igår",
      },
    ],
  },
];
