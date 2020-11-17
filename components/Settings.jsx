const {
	Webpack: {
		CommonModules: { React },
	},
	Tools: {
		ReactTools: { WrapBoundary },
	},
} = KLibrary;

const { FindModule } = KLibrary.Webpack;
const { SwitchItem } = require("powercord/components/settings");
const TotalMembersElement = require("./TotalMembersElement");
const { getLastSelectedGuildId } = FindModule.byProps("getLastSelectedGuildId");
const { getMemberCount } = FindModule.byProps("getMemberCount");

class Settings extends React.Component {
	constructor(props) {
		super(props);

		this.props.Settings.addReactSettingsFunctions(this);

		this.state = {
			settings: this.props.Settings.getSettings(),
		};
	}

	render() {
		const id = getLastSelectedGuildId();
		const total = getMemberCount(id);

		return (
			<React.Fragment>
				<SwitchItem
					value={this.getSetting("useMembersGroupStyle", false)}
					onChange={(event) => {
						this.setSetting(
							"useMembersGroupStyle",
							!this.getSetting("useMembersGroupStyle")
						);
					}}
					note=""
				>
					Use Member Group Style
				</SwitchItem>
				<TotalMembersElement
					Settings={this.props.Settings}
					total={total}
					counts={(async () => {
						return await this.props.getMemberCounts(id);
					})()}
					cached={this.props.cache[id]}
				/>
			</React.Fragment>
		);
	}
}

module.exports = WrapBoundary(Settings);
