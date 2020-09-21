const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { forceUpdateElement } = require("powercord/util");

const {
	Webpack: {
		FindModule,
		CommonModules: { React, FluxDispatcher },
	},
	Tools: { DOMTools },
} = KLibrary;

const { ListThin } = FindModule.byProps("ListThin");
const { requestMembers } = FindModule.byProps("requestMembers");
const { getLastSelectedGuildId } = FindModule.byProps("getLastSelectedGuildId");
const { getMemberCount } = FindModule.byProps("getMemberCount");

const Settings = require("./components/Settings");
const TotalMembersElement = require("./components/TotalMembersElement");

let cache = {};

module.exports = class TotalMembers extends Plugin {
	async startPlugin() {
		this.loadStylesheet("style.scss");

		this.Settings = new KLibrary.Settings(this.entityID);

		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: "Total Members",
			render: () =>
				React.createElement(Settings, {
					cache,
					Settings: this.Settings,
					getMemberCounts: this.getMemberCounts,
				}),
		});

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
					React.createElement(TotalMembersElement, {
						Settings: this.Settings,
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

		this.forceUpdateMembersList();
	}

	pluginWillUnload() {
		powercord.api.settings.unregisterSettings(this.entityID);
		uninject("total-members-members-list");
		this.forceUpdateMembersList();
	}

	forceUpdateMembersList() {
		forceUpdateElement(
			DOMTools.classNamesToSelectors(
				FindModule.classes("membersWrap").membersWrap
			)
		);
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
