import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import {ReplyBaseResult} from '../models/replyBaseResult';

dotenv.config();
const CLAUDE_BOT_ID = process.env.CLAUDE_BOT_ID;
const SLACK_AUTH_TOKEN = process.env.SLACK_AUTH_TOKEN;

class SlackClient extends WebClient {
    private channelID: string | undefined;
    private lastTS: string | undefined;

    async sendMessage(text: string): Promise<void> {
        if (!this.channelID) {
            const response = await this.conversations.open({ users: CLAUDE_BOT_ID });
            if (response.channel) {
                this.channelID = response.channel.id;
            } else {
                throw new Error('Failed to open channel.');
            }
        }
        if (!this.channelID) {
            throw new Error("Channel not found.");
        }
        const resp = await this.chat.postMessage({ channel: this.channelID, text });
        this.lastTS = resp.ts;
    }

    private async getResponse(maxAttempts: number = 5) {
        if (!this.channelID) {
            throw new Error('Channel not found.');
        }

        let attempts = 0;
        let response;
    
        while (attempts < maxAttempts) {
            response = await this.conversations.history({ channel: this.channelID, oldest: this.lastTS, limit: 2 });
    
            if (response.messages && response.messages.length > 0) {
                return response;
            }
    
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    
        return null;
    }

    private async _getReplyBase(): Promise<ReplyBaseResult | null> {
        let response = await this.getResponse();
        if (response && response.messages) {
            const messages = response.messages?.filter((msg) => msg.user === CLAUDE_BOT_ID);
            if (messages && messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                if (lastMessage.text) {
                    if (lastMessage.text.endsWith('Typing…_')) {
                        return { message: lastMessage.text.slice(0, -11), isTyping: true };
                    } else {
                        return { message: lastMessage.text, isTyping: false };
                    }
                }
            }
        }
        return null;
    }

    async *getReply(): AsyncIterable<string> {
        while (true) {
            const replyBaseResult = await this._getReplyBase();
            if (!replyBaseResult) {
                return;
            }
            const { message, isTyping } = replyBaseResult;
            if (!isTyping) {
                yield message;
                return;
            }
        }
    }

    async *getStreamReply(): AsyncIterable<string> {
        let lastMessage = '';
        while (true) {
            const replyBaseResult = await this._getReplyBase();
            if (!replyBaseResult) {
                return;
            }
            const { message, isTyping } = replyBaseResult;
            if (message !== lastMessage) {
                yield message.slice(lastMessage.length);
                lastMessage = message;
            }
            if (!isTyping) {
                return;
            }
        }
    }

}

const client = new SlackClient(SLACK_AUTH_TOKEN);
export default client;
