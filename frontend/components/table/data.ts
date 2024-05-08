import React from "react";
const columns = [
  { name: "Alarm", uid: "role" },
  { name: "Date", uid: "name" },
  { name: "STATUS", uid: "status" },
];

const users = [
  {
    id: 1,
    name: "14:34:50",
    role: "CODE 49",
    team: "Alarm details 1",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "15:01:24",
    role: "CODE 32",
    team: "Alarm details 2",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
];

export { columns, users };
