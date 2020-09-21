const {
	Webpack: {
		FindModule,
		CommonModules: { React },
	},
	Tools: {
		ReactTools: { WrapBoundary },
	},
} = KLibrary;
const classes = {
	...FindModule.classes("membersGroup"),
	...FindModule.classes("statusOnline"),
};

class TotalMembersElement extends React.Component {
	constructor(props) {
		super(props);

		this.props.Settings.addReactSettingsFunctions(this);

		this.state = {
			total: this.props.total,
			online: this.props.cached ? this.props.cached.online : null,
		};

		this.props.counts.then((counts) => {
			this.setState({
				total: counts.total == 0 ? this.state.total : counts.total,
				online: counts.online,
			});
		});
	}

	membersGroupStyle = () => {
		return (
			<div className={`total-members-group-box`}>
				<h2
					className={`total-members-count ${classes.membersGroup} container-2ax-kl`}
				>
					Total Members—{this.state.total.toLocaleString(undefined)}
				</h2>
				<h2
					className={`total-members-count ${classes.membersGroup} container-2ax-kl`}
				>
					Online Members—
					{this.state.online
						? this.state.online.toLocaleString(undefined)
						: "Loading..."}
				</h2>
			</div>
		);
	};

	countBoxStyle = () => {
		return (
			<div className={`total-members-count-box`}>
				<div className={`total-members-count ${classes.statusCounts}`}>
					<i
						className={`${classes.status} ${classes.statusOffline}`}
					></i>
					<span className={`${classes.count}`}>
						{this.state.total.toLocaleString(undefined)} Members
					</span>
				</div>
				<div className={`total-members-count ${classes.statusCounts}`}>
					<i
						className={`${classes.status} ${classes.statusOnline}`}
					></i>
					<span className={`${classes.count}`}>
						{this.state.online
							? `${this.state.online.toLocaleString(
									undefined
							  )} Online`
							: "Loading..."}
					</span>
				</div>
			</div>
		);
	};

	render() {
		return this.getSetting("useMembersGroupStyle", false)
			? this.membersGroupStyle()
			: this.countBoxStyle();
	}
}

module.exports = WrapBoundary(TotalMembersElement);
