import fastify from 'fastify';
import client from './api/slack';
import { ChatBody } from './models/chatBody';

const app = fastify();

async function handleStreamingReply(reply: any) {
  reply.raw.setHeader('Content-Type', 'text/plain');
  reply.raw.setHeader('Transfer-Encoding', 'chunked');
  for await (const messagePart of client.getStreamReply()) {
    reply.raw.write(messagePart);
  }
  reply.raw.end();
}

async function handleNonStreamingReply(reply: any) {
  const messages = [];
  for await (const message of client.getReply()) {
    messages.push(message);
  }
  reply.send({ claude: messages.join('') });
}

app.post<{ Body: ChatBody }>('/claude/chat', async (request, reply) => {
  const { prompt, streaming } = request.body;

  await client.sendMessage(prompt);

  if (streaming) {
    await handleStreamingReply(reply);
  } else {
    await handleNonStreamingReply(reply);
  }
});

app.post<{ Body: ChatBody }>('/claude/reset', async (request, reply) => {
  await client.sendMessage("/reset");

  await handleNonStreamingReply(reply);
});

app.listen({ port: 8080, host: '0.0.0.0'}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});