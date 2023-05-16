import { SlashCommandBuilder, commandBuilder } from "../helpers/types";
import { embedBuilder, reply } from "../helpers";

export default new commandBuilder({
    builder: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("RomanBot'un mesajlarına cevap vermediğini düşünüyorsanız, bu komutu kullanın."),

    run: async (interaction) => {
        reply(interaction, {
            embeds: [
                (await embedBuilder(interaction))
                .setTitle("Şey, ben yaşıyor muyum?")
                .setDescription("Bu mesajı gönderebiliğime göre aktif ve sapasağlamım 🥳")
                .data
            ]
        })
    }
})