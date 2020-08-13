const {
	React,
	getModuleByDisplayName,
	getModule,
} = require("powercord/webpack");
const ListSectionItem = getModuleByDisplayName("ListSectionItem", false);
const classes = getModule(["membersGroup"], false);

class TotalMembers extends React.Component {
	render() {
		// console.log(getMemberCount(this.props.id));
		return (
			<ListSectionItem
				className={`total-members-count ${classes.membersGroup}`}
			>
				<span>Total Members—{this.props.count}</span>
			</ListSectionItem>
		);
	}
}

module.exports = TotalMembers;
