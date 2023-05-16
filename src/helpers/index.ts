import { REST, RawFile } from "@discordjs/rest";
import { WebSocketManager } from "@discordjs/ws";
import { EmbedBuilder } from "@discordjs/builders";
import { Collection } from "@discordjs/collection";
import { Database } from "quickmongo";
import { GatewayDispatchEvents, GatewayIntentBits, InteractionType, Client, Routes, type APIInteraction, type RESTPostAPIWebhookWithTokenJSONBody, type MessageFlags } from "@discordjs/core";

import type { commandBuilder, eventsBuilder } from "./types";
import config from "../config";

import fs from "node:fs";
import path from "node:path";

export const mongosee = new Database(config.database.url);
export const rest = new REST({ version: "10" }).setToken(config.discord.token);
export const gateway = new WebSocketManager({ token: config.discord.token, intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages | GatewayIntentBits.GuildMembers | GatewayIntentBits.MessageContent, rest });
export const client = new Client({ rest, gateway });

export const commands: Collection<string, commandBuilder> = new Collection();

export const registerCommands = () => {
    fs.readdirSync(path.join(__dirname, "../commands")).filter((file: string) => file.endsWith(".ts")).forEach(async (file: string) => {
        const { default: Command }: { default: commandBuilder } = await import(`../commands/${file}`);

        if(Command && Command.data) {
            commands.set(Command.data.builder.name, Command);
        }
    });
}

export const registerEvents = () => {
    fs.readdirSync(path.join(__dirname, "../events")).filter((file: string) => file.endsWith(".ts")).forEach(async (file: string) => {
        const { default: Event }: { default: eventsBuilder } = await import(`../events/${file}`);

        if(Event && Event.data) {
            client[Event.data.once ? "on" : "once"](Event.data.name, (...args: any) => Event.data.run(...args));
        }
    });
}

client.on(GatewayDispatchEvents.InteractionCreate, async ({ data: interaction }) => {
    if(interaction.type === InteractionType.ApplicationCommand) {
        const commandData = commands.get(interaction.data.name);

        if(commandData && commandData.data) {
            commandData.data.run(interaction);
        }
    }
});

client.once(GatewayDispatchEvents.Ready, async () => {
    if(commands && commands.size !== 0) {
        rest.put(Routes.applicationCommands(config.discord.id), { body: commands.map((cmd) => cmd.data.builder) });
    } else {
        console.error("Ready: commands not found.")
    }
});

export const reply = async (interaction: APIInteraction, data: Omit<RESTPostAPIWebhookWithTokenJSONBody, "username" | "avatar_url"> & { flags?: MessageFlags; } & { files?: RawFile[]; },) => {
    client.api.interactions.reply(interaction.id, interaction.token, data)
}

export const update = async (interaction: APIInteraction, data: Omit<RESTPostAPIWebhookWithTokenJSONBody, "username" | "avatar_url"> & { flags?: MessageFlags; } & { files?: RawFile[]; },) => {
    client.api.interactions.updateMessage(interaction.id, interaction.token, data)
}

export const embedBuilder = async (interaction: APIInteraction) => {
    return new EmbedBuilder()
    .setColor(0x2B2D31)
    .setAuthor({ name: interaction.member?.user.username ?? "", iconURL: `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}?size=1024` })
    .setTimestamp()
    .setFooter({ text: `${(await client.api.users.get(interaction.application_id)).username} • Bizi tercih ettiğiniz için teşekkürler!`, iconURL: `https://cdn.discordapp.com/avatars/${(await client.api.users.get(interaction.application_id)).id}/${(await client.api.users.get(interaction.application_id)).avatar}?size=1024` })
}

export const getOption = (interaction: APIInteraction, name: string): { value: string, type: number, name: string } => {
    // @ts-ignore
    return interaction.data.options.find((option => option.name === name));
}

export default {
    rest,
    gateway,
    client,
    commands,
    reply,
    registerCommands,
    registerEvents,
    embedBuilder
}