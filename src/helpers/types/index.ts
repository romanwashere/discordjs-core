import  { SlashCommandBuilder, type SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import type { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { type MappedEvents, GatewayDispatchEvents } from "@discordjs/core"

export interface ICommands {
    builder:
        | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
        | SlashCommandSubcommandsOnlyBuilder;
    run: (interaction: APIApplicationCommandInteraction ) => Promise<void> | any;
}

export interface IEvents {
    name: keyof MappedEvents;
    once?: boolean
    run: (...args: any) => Promise<void> | any;
}

export class commandBuilder {
    public data: ICommands;

    constructor (data: ICommands) {
        if (!data) console.error("SlashCommandsBuilder: Slash command data must be given.");
        
        this.data = data;
    }
}

export class eventsBuilder {
    public data: IEvents;

    constructor (data: IEvents) {
        if (!data) console.error("SlashCommandsBuilder: Slash command data must be given.");
        
        this.data = data;
    }
}

export {
    SlashCommandBuilder,
    GatewayDispatchEvents
}