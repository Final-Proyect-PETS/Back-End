//                     __
//                   .'  '.
//               _.-'/  |  \
//  ,        _.-"  ,|  /  0 `-.
//  |\    .-"       `--""-.__.'=====================-,
//  \ '-'`        .___.--._)=========================|
//   \            .'      |                          |
//    |     /,_.-'        |        ADOPTEN ︻╦̵̵͇̿̿̿̿╤──    |
//  _/   _.'(             |           O              |
// /  ,-' \  \            |        MUERAN  ︻┳═ 一   |
// \  \    `-'            |                          |
//  `-'                   '--------------------------'
require("dotenv").config();
const http = require("http");
const server = require("./src/app.js");
const connection = require("./src/db.js");
const serverr = http.createServer(server);
const { Server } = require("socket.io");
const io = new Server(serverr, {
  cors: {
    origin: "https://happytails.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: [],
    credentials: true,
    allowEIO3: true,
  },
  transport: ["websocket"],
});

let users = [];

const addUser = (id, socketId) => {
  !users.some((user) => user.id === id) && users.push({ id, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

io.on("connection", (socket) => {
  console.log("New User Logged In with ID " + socket.id);
  socket.on("addUser", (id) => {
    addUser(id, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

connection();
serverr.listen(process.env.PORT || 3001, () =>
  console.log(`listening at port ${process.env.PORT}`)
);
