import { client } from "../helpers";
import { GatewayDispatchEvents, eventsBuilder } from "../helpers/types";
import { GatewayReadyDispatchData, WithIntrinsicProps, ActivityType, PresenceUpdateStatus } from "@discordjs/core"

export default new eventsBuilder({
    name: GatewayDispatchEvents.Ready,
    once: true,

    run: ({ data }: WithIntrinsicProps<GatewayReadyDispatchData>) => {
        client.updatePresence(0, { activities: [{ name: "discord.gg/altyapilar", type: ActivityType.Competing }], since: null, status: PresenceUpdateStatus.Online, afk: false }).then(() => console.log(`${data.user.username} is ready.`))
    }
})