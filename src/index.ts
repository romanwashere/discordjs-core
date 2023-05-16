import { gateway, mongosee, registerCommands, registerEvents } from "./helpers";

registerCommands()
registerEvents()

gateway.connect().then(() => mongosee.connect());