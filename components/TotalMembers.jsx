const { React, getModule } = require("powercord/webpack");
const classes = {
	...getModule(["membersGroup"], false),
	...getModule(["statusOnline"], false),
};

class TotalMembers extends React.Component {
	constructor(props) {
		super(props);

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

	render() {
		return (
			<div className={`total-members-count-box`}>
				<div className={`total-members-count ${classes.statusCounts}`}>
					<i
						className={`${classes.status} ${classes.statusOffline}`}
					></i>
					<span className={`${classes.count} total-members-count-number`}>
						{this.state.total.toLocaleString(undefined)}
					</span>
					<span className={`${classes.count}`}>
						Members
					</span>
				</div>
				<div className={`total-members-count ${classes.statusCounts}`}>
					<i
						className={`${classes.status} ${classes.statusOnline}`}
					></i>
					<span className={`${classes.count} total-members-count-number`}>
						{this.state.online
							? `${this.state.online.toLocaleString(undefined)}`
							: "Loading..."}
					</span>
					<span className={`${classes.count}`}>{this.state.online && `Online`}</span>
				</div>
			</div>
		);
	}
}

module.exports = TotalMembers;
