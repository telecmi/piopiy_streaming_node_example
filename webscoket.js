const WebSocket = require('ws');
const fs = require('fs');
const wav = require('wav');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

const channels = 1; // Number of audio channels (1 for mono, 2 for stereo)
const sampleRate = 8000; // Sample rate in Hz (typically 8000 or 16000 for telephony)
const bitDepth = 16; // Bit depth for L16 format

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Create a WAV file writer
    const wavFileWriter = new wav.FileWriter('output.wav', {
        channels: channels,
        sampleRate: sampleRate,
        bitDepth: bitDepth
    });

    ws.on('message', (data) => {
        // Check if the received data is binary
        if (data instanceof Buffer) {
            wavFileWriter.write(data);
        } else {
            console.log('Received non-binary data:', data.toString());
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        wavFileWriter.end(); // Ensure the WAV file is properly closed
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        wavFileWriter.end(); // Close the WAV file on error
    });
});

console.log('WebSocket server is listening on ws://localhost:8080');