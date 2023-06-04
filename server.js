const WebSocket = require("ws");
const express = require("express");
const app = express();
const path = require("path");

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = app.listen(8000, () => {
  console.log("Server listening on port 8000");

  const wss = new WebSocket.Server({ server });

  wss.on("connection", (socket) => {
    let partialTranscriptions = [];

    socket.on("message", (data) => {
      const transcription = data;
      partialTranscriptions.push(transcription);
      socket.send(transcription);
    });

    socket.on("close", () => {
      const finalTranscription = partialTranscriptions.join(" ");
      socket.send(finalTranscription);
    });
  });
});
