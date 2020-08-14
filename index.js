const { Plugin } = require("powercord/entities");
const { React, getModule, FluxDispatcher } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");
const { ListThin } = getModule(["ListThin"], false);
const { requestMembers } = getModule(["requestMembers"], false);
const { getLastSelectedGuildId } = getModule(["getLastSelectedGuildId"], false);
const { getMemberCount } = getModule(["getMemberCount"], false);
const TotalMembers = require("./components/TotalMembers");

let cache = {};

module.exports = class MessageTranslate extends Plugin {
	async startPlugin() {
		this.loadStylesheet("style.scss");

		inject(
			"total-members-members-list",
			ListThin,
			"render",
			(args, reactElement) => {
				if (
					!args[0] ||
					!args[0].id ||
					!args[0].id.startsWith("members")
				)
					return reactElement;

				const id = getLastSelectedGuildId();
				const total = getMemberCount(id);
				reactElement.props.children = [
					React.createElement(TotalMembers, {
						total,
						counts: (async () => {
							return await this.getMemberCounts(id);
						})(),
						cached: cache[id],
					}),
					reactElement.props.children,
				];

				return reactElement;
			}
		);
	}

	pluginWillUnload() {
		uninject("total-members-members-list");
	}

	getMemberCounts(id) {
		return new Promise((resolve, reject) => {
			function onMembers(guild) {
				if (guild.guildId == id) {
					let total = guild.memberCount;
					let online = guild.groups
						.map((group) => {
							return group.id != "offline" ? group.count : 0;
						})
						.reduce((a, b) => {
							return a + b;
						}, 0);

					console.log(guild.groups);

					cache[id] = { total, online };

					FluxDispatcher.unsubscribe(
						"GUILD_MEMBER_LIST_UPDATE",
						onMembers
					);
					resolve({
						total,
						online,
					});
				}
			}
			FluxDispatcher.subscribe("GUILD_MEMBER_LIST_UPDATE", onMembers);
			requestMembers(id);
		});
	}
};
