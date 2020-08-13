const { Plugin } = require("powercord/entities");
const { React, getModule } = require("powercord/webpack");
const { findInReactTree } = require("powercord/util");
const { inject, uninject } = require("powercord/injector");
const { ListThin } = getModule(["ListThin"], false);
const { getLastSelectedGuildId } = getModule(["getLastSelectedGuildId"], false);
const { getMemberCount } = getModule(["getMemberCount"], false);
const TotalMembers = require("./components/TotalMembers");

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

				const list = findInReactTree(
					reactElement,
					(el) =>
						el && el.className && el.className.startsWith("content")
				);

				const count = getMemberCount(getLastSelectedGuildId());
				list.children.splice(
					1,
					0,
					React.createElement(TotalMembers, { count })
				);

				return reactElement;
			}
		);
	}

	pluginWillUnload() {
		uninject("total-members-members-list");
	}
};
