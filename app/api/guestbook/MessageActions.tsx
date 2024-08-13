"use server";

// File System - Read/Write JSON
import { tmpdir } from "os";
import fs from "fs";

// My Messages
import IMessage from "@/app/guestbook/components/MessageInterface";
import messages from "@/data/guestbook/messages.json";

// Environment Variables
// - If is development, use the local JSON file
//   - Avoid creating temp in local computer
// - If is production, use the temp JSON file
//   - Vercel does not support write files
const IS_PROD: string | undefined = process.env.IS_PROD;
const isProd: boolean = IS_PROD === "true";

interface IMessageActions {
    getAllMessages(order: "ASC" | "DESC"): Array<IMessage>;
    addMessage(message: string, username: string): void;
}

class MessageActions {
    private key: "id";
    private jsonUrl: string;
    private tempJsonUrl: string;

    public constructor() {
        this.key = "id";

        // Local JSON file
        const cwd = process.cwd();
        this.jsonUrl = `${cwd}/data/guestbook/messages.json`;

        // Create a temporary directory
        const directory = tmpdir();
        this.tempJsonUrl = `${directory}/messages.json`;

        // If is production, write the initial messages to the temp JSON file
        if (isProd) {
            // Write the initial messages to the temp JSON file
            const initialMessages: Array<IMessage> = messages;
            fs.writeFile(
                this.tempJsonUrl,
                JSON.stringify(initialMessages),
                function (err: any) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        }
    }

    /**
     * Get all messages.
     * @return {Array<IMessage>} All messages.
     */
    public getAllMessages(order: "ASC" | "DESC"): Array<IMessage> {
        const finalJsonUrl: string = isProd ? this.tempJsonUrl : this.jsonUrl;

        const data = fs.readFileSync(finalJsonUrl).toString();
        const messages: Array<IMessage> = JSON.parse(data);

        return this.sortBy(messages, order);
    }

    /**
     * Sort an array by a given key and order.
     * @param {Array<IMessage>} data - The data to be sorted.
     * @param {string} key - The key to sort by.
     * @param {string} order - The order to sort by.
     * @return {Array<IMessage>} The sorted data.
     */
    private sortBy(
        data: Array<IMessage>,
        order: "ASC" | "DESC"
    ): Array<IMessage> {
        return data.sort((a: IMessage, b: IMessage): number => {
            if (order === "DESC") [a, b] = [b, a];
            return a[this.key] - b[this.key];
        });
    }

    /**
     * Adds a message into the JSON database.
     * @param {string} message - The message to save.
     * @param {string} username - The username that created.
     */
    public addMessage(message: string, username: string) {
        const finalJsonUrl: string = isProd ? this.tempJsonUrl : this.jsonUrl;

        const data = fs.readFileSync(finalJsonUrl).toString();
        let dbMessages: Array<IMessage> = JSON.parse(data);

        dbMessages.push({
            id: messages.length + 1,
            message: message,
            username: username,
            created_at: new Date().toISOString(),
        });

        fs.writeFile(
            finalJsonUrl,
            JSON.stringify(dbMessages),
            function (err: any) {
                if (err) {
                    console.log(err);
                }
            }
        );
    }
}

// Object init
const myMessageActions: IMessageActions = new MessageActions();

// Server API to get all messages
export async function getAllMessages(
    order: "ASC" | "DESC"
): Promise<Array<IMessage>> {
    return myMessageActions.getAllMessages(order);
}

// Server API to get add a message
export async function addMessage(
    message: string,
    username: string
): Promise<boolean> {
    myMessageActions.addMessage(message, username);
    return true;
}
