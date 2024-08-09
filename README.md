# PIOPIY Streaming Node Example

This document provides details on how to set up and run a WebSocket server to handle streaming.

## Overview

The WebSocket server listens for incoming audio streams, saves the data as a WAV file, and manages client connections.

## Prerequisites

Before running the WebSocket server, ensure you have the following installed:

- <a href="https://nodejs.org/en/" target="_blank">node.js</a> (>= v20.12.0 required)

## Steps to Set Up

### 1. Clone the Repository

Use the `git clone` command to clone the PIOPIY node from the TeleCMI GitHub repository.

```sh
git clone https://github.com/telecmi/piopiy_streaming_node_example.git
```

First, clone this repository to your local machine:

```sh
cd piopiy_streaming_node_example
```

### 2. Install the npm Package

Once inside the project directory, install the required npm packages:

```sh
npm install
```

### 3. WebSocket Server Code

Here is the code to create and run the WebSocket server:

```javascript
const WebSocket = require("ws");
const fs = require("fs");
const wav = require("wav");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

const channels = 1; // Number of audio channels (1 for mono, 2 for stereo)
const sampleRate = 8000; // Sample rate in Hz (typically 8000 or 16000 for telephony)
const bitDepth = 16; // Bit depth for L16 format

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Create a WAV file writer
  const wavFileWriter = new wav.FileWriter("output.wav", {
    channels: channels,
    sampleRate: sampleRate,
    bitDepth: bitDepth,
  });

  ws.on("message", (data) => {
    // Check if the received data is binary
    if (data instanceof Buffer) {
      wavFileWriter.write(data);
    } else {
      console.log("Received non-binary data:", data.toString());
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    wavFileWriter.end(); // Ensure the WAV file is properly closed
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    wavFileWriter.end(); // Close the WAV file on error
  });
});

console.log("WebSocket server is listening on ws://localhost:8080");
```

### 4. Running the WebSocket Server

To run the server:

1.Save the code in a file named websocket.js.

2.Run the server with the following command:

```sh
node websocket.js
```
