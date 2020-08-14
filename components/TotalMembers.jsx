const {
	React,
	getModule,
} = require("powercord/webpack");
const classes = {
	...getModule(["membersGroup"], false),
	...getModule(["statusOnline"], false),
};

class TotalMembers extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			total: this.props.total,
			online: this.props.cached ? this.props.cached.online : 0,
		};

		this.props.counts.then((counts) => {
			this.setState({ total: counts.total, online: counts.online });
		});
	}

	render() {
		return (
			<div className={`total-members-count-box ${classes.membersGroup}`}>
				<div className={`${classes.statusCounts}`}>
					<div className="total-members-count">
						<i
							className={`${classes.status} ${classes.statusOffline}`}
						></i>
						<span className={`${classes.count}`}>
							{this.state.total} Members
						</span>
					</div>
					<div className="total-members-count">
						<i
							className={`${classes.status} ${classes.statusOnline}`}
						></i>
						<span className={`${classes.count}`}>
							{this.state.online} Online
						</span>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = TotalMembers;
