const database = require("../database/Database");
const rest = require("../api/DiscordRest");
const {Routes} = require("discord-api-types/v9");
const {clientId} = require("../../config.json");

module.exports = async function registerRemoveDomain(guildId, removeDomain = require("../commands/removedomain")) {
    await database.getServerSettings(guildId, async serverSettings => {
        rest.get(Routes.applicationGuildCommands(clientId, guildId)).then(commands => {
            const commandId = commands.find(command => command.name === "removedomain")?.id

            if (!commandId) return

            let removeDomainCommand = removeDomain.data.toJSON()
            removeDomainCommand["options"][0]["choices"] = serverSettings.domains.map(domain => {
                return {"name": domain, "value": domain}
            })
            rest.patch(Routes.applicationGuildCommand(clientId, guildId, commandId), {body: removeDomainCommand}).catch()
        }).catch()
    })
}