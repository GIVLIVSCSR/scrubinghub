import React, { Component } from "react";
import { randomForBomb } from "../utils/random";

const toNum = (x) => parseInt(x, 10);

const style = {
	width: "43px",
	height: "43px",
	borderRadius: "50%",
	position: "absolute",
	userSelect: "none",
	textAlign: "center",
	lineHeight: "35px",
	cursor: "pointer",
	opacity: 0,
  transition: "ease 0.3s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

class Bomb extends Component {
	state = {
		dragging: false,
		x: this.props.leftCoords, 
		y: this.props.topCoords,
		showBomb: randomForBomb(5, 11),
    showUp: false
	};

	componentDidMount() {
		const show = this.state.showBomb;
		this.removeBombCycle = setTimeout(this.removeBomb, show * 1000);
		this.showNewBombCycle = setTimeout(this.showNewBomb, 100);
		this.changeShowCylce = setInterval(this.changeShow, 1000);
		document.addEventListener("mousemove", this.handleMouseMove);
  };

  componentWillUpdate(nextProps) {
    if (nextProps.gameInit === 0) {
      clearTimeout(this.removeBombCycle);
      clearTimeout(this.showNewBombCycle);
      clearInterval(this.changeShowCylce);
      document.removeEventListener("mousemove", this.hadleMousemove);
    }
  };
  
  componentWillUnmount() {
    clearTimeout(this.removeBombCycle);
    clearTimeout(this.showNewBombCycle);
    clearInterval(this.changeShowCylce);
    document.removeEventListener("mousemove", this.hadleMousemove);
  };

  showNewBomb = () => {
    this.setState({ showUp: true })
    let time = new Date()
    const { x, y } = this.state
    const { id } = this.props
    const bombProperties = { left: toNum(x), top: toNum(y), id: id, width: 45, height: 45 }
    this.props.addToTheListOfDisplayedBombs(bombProperties)
  };

	changeShow = () => {
    const { showBomb } = this.state;
		this.setState({ showBomb: showBomb - 1 });
	};

  handleMouseDown = e => this.setState({ dragging: true, showUp: false });
  
  //change bomb's position
	handleMouseMove = e => {
		const { dragging, x, y } = this.state;
		const { currentBomb, setCurrentBomb, color, id, removed } = this.props;

		if (dragging && !removed) {
      this.setState({ x: e.clientX, y: e.clientY });
			let bombProperties = {
				left: x,
				top: y
			};
			setCurrentBomb(bombProperties, color, id);
		}
	};

	removeBomb = () => {
    const { setPoints, id, removed, gameInit } = this.props;
    this.props.removeBombFromDisplayedList(id);
		if (removed) {
			this.bomb.remove();
		} else {
			setPoints("Down");
			this.bomb.remove();
		}
	};

	removeDragging = () => this.setState({ dragging: false });

	render() {
		const { x, y, showBomb, showUp } = this.state;
		const { color, id } = this.props;

		if (this.bomb && showUp) {
			this.bomb.style.width = "45px";
			this.bomb.style.height = "45px";
      this.bomb.style.opacity = 1;
		} else if (this.bomb && !showUp) {
			this.bomb.style.transition = "none";
    }

    if (this.props.gameInit === 0) {
     return <div></div>
    } 

		return (
			<div
				ref={ref => (this.bomb = ref)}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
				style={{
					...style,
					left: x,
					top: y,
          background: color,
				}}
				id={id}
			>
				<span style={{color: "#fff", fontSize: "21px"}}>{showBomb}</span>
			</div>
		);
	}
}

export default Bomb;
