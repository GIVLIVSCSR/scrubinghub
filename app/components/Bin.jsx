import React, { Component } from "react";

const binPlacer = {
	width: "200px",
	height: "200px",
	marginLeft: "15px",
	marginRight: "15px",
	display: "inline-block",
	position: "relative"
};

const style = {
	width: "150px",
	height: "150px",
	position: "absolute", 
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	marginLeft: "auto",
	marginRight: "auto",
	opacity: 1,
	transition: "width 0.5s, height 0.5s, opacity 0.5s"
};

class Bin extends Component {
	state = {
		resize: false
	};

	handleMouseEnter = () => {
		if (this.props.bomb.color && this.props.bomb.id) {
			const { bomb, backgroundColor, setPoints, gameInit } = this.props;
			if (bomb.color === backgroundColor) {
				this.setState({ resize: true });
				setPoints("Up", true);
			} else {
				setPoints("Down", true);
			}
		}
	};

	handleMouseLeave = () => {
		const { resize } = this.state;
		if (resize) {
			this.setState({ resize: false });
		} else {
			return;
		}
	};

	render() {
		const { resize } = this.state;
		const { backgroundColor } = this.props;

		if (resize && this.bin) {
			this.bin.style.width = "170px";
			this.bin.style.height = "170px";
			this.bin.style.opacity = 0.5;
		} else if (!resize && this.bin) {
			this.bin.style.width = "150px";
			this.bin.style.height = "150px";
			this.bin.style.opacity = 1;
		}

		return (
			<div style={binPlacer}>
				<div
					ref={ref => (this.bin = ref)}
					style={{ ...style, background: backgroundColor }}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
				/>
			</div>
		);
	}
}

export default Bin;
