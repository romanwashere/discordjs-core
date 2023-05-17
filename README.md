# Building a bot with packages created with discord.js
This open source project is a template prepared to be used in the projects I will make.

## How to install? 
- First install the project on your computer with `git`.
- The second step is to go to the `./src/config.ts` file and fill in the required fields.
- the third step is time to download the packages, it may take some time.

```powershell
npm install
# or
pnpm install
# or
yarn install
```
- finally typing `npm run start`
- Tadaa, your bot is now active! 🥳

## Tips
```ts
import { reply, update, embedBuilder, getOption } from "../helpers";

/* reply a message */
reply(interaction<APIInteraction>, { content: "hello world!" });

/* update a message *when interacting */
update(interaction<APIInteraction>, { content: "hello world, again!" });

/* create an embed message */
reply(interaction<APIInteraction>, { embeds: [(await embedBuilder(interaction)).setDescription("hi, i am roman").data] });

/* find interaction options. */
getOption(interaction<APIInteraction>, "content");

```

> Designer and coding: @romanwashere
