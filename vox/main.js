import Fastify from 'fastify';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import fastifyFormBody from '@fastify/formbody';
import fastifyWs from '@fastify/websocket';
import mongoose from 'mongoose';

dotenv.config();

const { OPENAI_API_KEY, MONGO_URI } = process.env;

if (!OPENAI_API_KEY) {
  console.error('No OPENAI KEY');
  process.exit(1);
}

if (!MONGO_URI) {
  console.error('No MONGO_URI provided');
  process.exit(1);
}

async function loadClientDatabaseAndPrompt() {

  const mainConn = await mongoose.createConnection(MONGO_URI).asPromise();

  const User = mainConn.model('User', new mongoose.Schema({}, { strict: false }), 'users');
  const user = await User.findOne({ companyName: "Paul's Hardware" }).lean();
  if (!user) {
    console.error("User with companyName 'Paul's Hardware' not found.");
    process.exit(1);
  }

  const agentCarlos = (user.agents || []).find(agent => agent.name === "Carlos");
  if (!agentCarlos || !agentCarlos.prompt) {
    console.error("Agent 'Carlos' with a prompt not found.");
    process.exit(1);
  }
  const dbPrompt = agentCarlos.prompt;

  const companyURI = user.companyURI;
  await mainConn.close();

  const clientConn = await mongoose.createConnection(companyURI).asPromise();
  const collections = await clientConn.db.listCollections().toArray();
  let allData = [];
  for (const coll of collections) {
    const docs = await clientConn.db.collection(coll.name).find({}).toArray();
    allData = allData.concat(docs);
  }
  await clientConn.close();
  return { CLIENT_DATABASE: allData, DB_PROMPT: dbPrompt };
}

const VOICE = 'alloy';
const PORT = process.env.PORT || 5050;

const LOG_EVENT_TYPES = [
  'error',
  'response.content.done',
  'rate_limits.updated',
  'response.done',
  'input_audio_buffer.committed',
  'input_audio_buffer.speech_stopped',
  'input_audio_buffer.speech_started',
  'session.created'
];

const SHOW_TIMING_MATH = false;

var SYSTEM_PROMPT = ""; 
var CLIENT_DATABASE = [];
var DB_PROMPT = "";

const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

fastify.get('/', async (request, reply) => {
  reply.send({ message: 'Haboubz Customer Service Running' });
});

fastify.all('/incoming-call', async (request, reply) => {
  ({ CLIENT_DATABASE, DB_PROMPT } = await loadClientDatabaseAndPrompt());

  SYSTEM_PROMPT = `
  AI Customer Service Agent for Paul's Hardware.
  
  ONLY Use the provided database for accurate information to customers:
  *********DATABASE START*********
  ${JSON.stringify(CLIENT_DATABASE)}
  *********DATABASE END*********

  
  Company Prompt:
  *********COMPANY PROMPT START*********
  ${DB_PROMPT}
  *********COMPANY PROMPT END*********
  
  Assist customers based on these instructions.
  `;


  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://${request.headers.host}/media-stream" />
  </Connect>
</Response>`;
  reply.type('text/xml').send(twimlResponse);
});


fastify.register(async (fastify) => {
  fastify.get('/media-stream', { websocket: true }, (connection, req) => {
    console.log('Client connected');
    let streamSid = null;
    let latestMediaTimestamp = 0;
    let lastAssistantItem = null;
    let markQueue = [];
    let responseStartTimestampTwilio = null;

    const openAiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "realtime=v1"
      }
    });

    const initializeSession = () => {
      const sessionUpdate = {
        type: 'session.update',
        session: {
          turn_detection: { type: 'server_vad' },
          input_audio_format: 'g711_ulaw',
          output_audio_format: 'g711_ulaw',
          voice: VOICE,
          instructions: SYSTEM_PROMPT,
          modalities: ["text", "audio"],
          temperature: 0.8
        }
      };
      console.log('Sending session update:', JSON.stringify(sessionUpdate));
      openAiWs.send(JSON.stringify(sessionUpdate));
      sendInitialConversationItem();
    };

    const sendInitialConversationItem = () => {
      const initialConversationItem = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text: 'Hello How can I help you?"' }]
        }
      };
      if (SHOW_TIMING_MATH)
        console.log('Sending initial conversation item:', JSON.stringify(initialConversationItem));
      openAiWs.send(JSON.stringify(initialConversationItem));
      openAiWs.send(JSON.stringify({ type: 'response.create' }));
    };

    const handleSpeechStartedEvent = () => {
      if (markQueue.length > 0 && responseStartTimestampTwilio != null) {
        const elapsedTime = latestMediaTimestamp - responseStartTimestampTwilio;
        if (SHOW_TIMING_MATH)
          console.log(`Calculating elapsed time for truncation: ${latestMediaTimestamp} - ${responseStartTimestampTwilio} = ${elapsedTime}ms`);
        if (lastAssistantItem) {
          const truncateEvent = {
            type: 'conversation.item.truncate',
            item_id: lastAssistantItem,
            content_index: 0,
            audio_end_ms: elapsedTime
          };
          if (SHOW_TIMING_MATH)
            console.log('Sending truncation event:', JSON.stringify(truncateEvent));
          openAiWs.send(JSON.stringify(truncateEvent));
        }
        connection.send(JSON.stringify({ event: 'clear', streamSid: streamSid }));
        markQueue = [];
        lastAssistantItem = null;
        responseStartTimestampTwilio = null;
      }
    };

    const sendMark = (connection, streamSid) => {
      if (streamSid) {
        const markEvent = {
          event: 'mark',
          streamSid: streamSid,
          mark: { name: 'responsePart' }
        };
        connection.send(JSON.stringify(markEvent));
        markQueue.push('responsePart');
      }
    };

    openAiWs.on('open', () => {
      console.log('Connected to the OpenAI Realtime API');
      setTimeout(initializeSession, 100);
    });

    openAiWs.on('message', (data) => {
      try {
        const response = JSON.parse(data);
        if (LOG_EVENT_TYPES.includes(response.type)) {
          console.log(`Received event: ${response.type}`, response);
        }
        if (response.type === 'response.audio.delta' && response.delta) {
          const audioDelta = {
            event: 'media',
            streamSid: streamSid,
            media: { payload: response.delta }
          };
          connection.send(JSON.stringify(audioDelta));
          if (!responseStartTimestampTwilio) {
            responseStartTimestampTwilio = latestMediaTimestamp;
            if (SHOW_TIMING_MATH)
              console.log(`Setting start timestamp for new response: ${responseStartTimestampTwilio}ms`);
          }
          if (response.item_id) {
            lastAssistantItem = response.item_id;
          }
          sendMark(connection, streamSid);
        }
        if (response.type === 'input_audio_buffer.speech_started') {
          handleSpeechStartedEvent();
        }
      } catch (error) {
        console.error('Error processing OpenAI message:', error, 'Raw message:', data);
      }
    });

    connection.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        switch (data.event) {
          case 'media':
            latestMediaTimestamp = data.media.timestamp;
            if (SHOW_TIMING_MATH)
              console.log(`Received media message with timestamp: ${latestMediaTimestamp}ms`);
            if (openAiWs.readyState === WebSocket.OPEN) {
              const audioAppend = { type: 'input_audio_buffer.append', audio: data.media.payload };
              openAiWs.send(JSON.stringify(audioAppend));
            }
            break;
          case 'start':
            streamSid = data.start.streamSid;
            console.log('Incoming stream has started', streamSid);
            responseStartTimestampTwilio = null;
            latestMediaTimestamp = 0;
            break;
          case 'mark':
            if (markQueue.length > 0) {
              markQueue.shift();
            }
            break;
          default:
            console.log('Received non-media event:', data.event);
            break;
        }
      } catch (error) {
        console.error('Error parsing message:', error, 'Message:', message);
      }
    });

    connection.on('close', () => {
      if (openAiWs.readyState === WebSocket.OPEN)
        openAiWs.close();
      console.log('Client disconnected.');
    });

    openAiWs.on('close', () => {
      console.log('Disconnected from the OpenAI Realtime API');
    });

    openAiWs.on('error', (error) => {
      console.error('Error in the OpenAI WebSocket:', error);
    });
  });
});

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is listening on port ${PORT}`);
});
