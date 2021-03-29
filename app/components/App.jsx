import React, { Component } from "react";
import Bomb from "./Bomb";
import Bin from "./Bin";
import { randomForColors } from "../utils/random";
import { getUniquePosition } from "../utils/newPosition"

const binContainer = {
	width: "800px",
	marginLeft: "auto",
	marginRight: "auto", 
	position: "absolute",
	top: "60vh",
	left: 0,
	right: 0,
	textAlign: "center"
};

const changeInContainer = {
  position: "absolute",
  bottom: "0px",
  textAlign: "right",
  background: "#001fff",
  width: "100vw"
};

const changeInStyle = {
  fontSize: "19px",
  textTransform: "uppercase",
  color: "#fff",
  display: "inline-block",
  padding: "5px 15px"

};

const resetGameContainer = {
  textAlign: "center"
};

const timer = {
  display: "inline-block",
  background: "red",
  color: "#fff",
  textTransform: "uppercase",
  letterSpacing: "5px",
  boxSizing: "border-box",
  padding: "10px 17px",
  marginBottom: "5px"
};

const score = {
  fontSize: "19px",
  color: "#fff",
  paddingLeft: "5px"
};

const btn = {
  boxSizing: "border-box",
  padding: "11px 21px",
  textTransform: "uppercase",
  letterSpacing: "3px",
  background: "#000",
  color: "red",
  cursor: "pointer",
  borderStyle: "none",
  border: "1px solid red",
  borderRadius: " 17px",
  fontSize: "10px"
};

const titleStyle = {
  color: "#fff",
  fontWeight: "500"
};

const colors = ["#269dff", "#f253f5", "#ff5722"];

const pickColor = () => colors[randomForColors(0, 3)];

class App extends Component {
	state = {
		points: 0,
		inBins: 0,
		colorsForBins: colors,
		spawnedBombs: [],
		currentBomb: {
			properties: null,
			color: null,
			id: null
		},
    removedBombs: [],
    displayedBombs: [],
    changeIn: 5,
    timesCollingCounter: 0,
    gameInit: 60
	};

	componentDidMount() {
    this.changeIn = setInterval(this.makeChangeIn, 1000);
    this.setGame = setInterval(this.setupGame, 1000);
    this.changeCounter = setTimeout(() => this.setCounter(5000), 2500); 
    this.spawnBomb();
	};

  componentDidUpdate() {
    if (this.state.gameInit === 0) {
      clearInterval(this.changeIn);
      clearInterval(this.setGame);
      clearTimeout(this.changeCounter);
    }
  };

  componentWillUnmount() {
    clearInterval(this.changeIn);
    clearInterval(this.setGame);
    clearTimeout(this.changeCounter);
  };

	setCounter = counter => {
	  this.spawnBomb();
		const { spawnedBombs } = this.state;
    this.setState(prevState => ({ timesCollingCounter: prevState.timesCollingCounter + 1 }))
		if (spawnedBombs.length === 170) return;
		if (counter === 500) {
			return setTimeout(() => this.setCounter(counter), counter);
		}

		return setTimeout(() => this.setCounter(counter - 500), counter);
	};

  //make bin swap colors every 30 sec 
	makeChangeIn = () => {
    console.log('changeIn')
    const { changeIn } = this.state;
		if (changeIn === 0) {
			this.setState({ changeIn: 5 });
			this.swapColors();
		} else {
			this.setState(prevState => ({ changeIn: prevState.changeIn - 1 }));
		}
  };
  
  setupGame = () => {
    this.setState(prevState => ({ gameInit: prevState.gameInit - 1 }));
  }

	swapColors = () => {
		const [x, y, z] = this.state.colorsForBins;
		const swappedColors = [y, z, x];
		this.setState({ colorsForBins: swappedColors });
	};

  // spawn new bombs
	spawnBomb = () => {
		const { spawnedBombs, displayedBombs, inBins, gameInit } = this.state;
		let newBomb, colorBomb;
    if (gameInit !== 0) {
      console.log('inBins', inBins);
			newBomb = spawnedBombs.length.toString();
      colorBomb = pickColor();
      const bombPosition = getUniquePosition(displayedBombs);
			this.setState(prevState => ({
				spawnedBombs: [
					...prevState.spawnedBombs,
					{ id: newBomb, color: colorBomb, top: bombPosition.top, left: bombPosition.left }
				]
      }));
		} else {
			null;
		}
	};

	setCurrentBomb = (bombProperties, color, id) => {
		const { removedBombs } = this.state;

		if (removedBombs.includes(id)) {
			this.setState({
				currentBomb: null
			});
		} else {
			this.setState({
        currentBomb: { properties: bombProperties, color: color, id: id }
			});
		}
	};

	removeCurrentBomb = () => {
		const { currentBomb, removedBombs } = this.state;
		document.getElementById(currentBomb.id).remove();
    this.removeBombFromDisplayedList(currentBomb.id);
		this.setState({
			removedBombs: [...removedBombs, currentBomb.id],
			currentBomb: { properties: null, color: null, id: null }
		});
  };
  
  
   addToTheListOfDisplayedBombs = bomb => {
     const { displayedBombs } = this.state;
     this.setState({ displayedBombs: [ ...displayedBombs, bomb ] })
   };
   
   
   removeBombFromDisplayedList = id => {
     const { displayedBombs } = this.state
     const refreshedList = displayedBombs.filter(bomb => bomb.id !== id )
     this.setState({ displayedBombs: refreshedList })
   };
   

  //check wether bomb got to bin and if so, remove it from there 
  //change score according to args of expr 
	setPoints = (expr, fromBin = false) => {
    if (this.state.gameInit === 0) {
      return;
    }
		if (fromBin) {
			this.removeCurrentBomb();
		}
		switch (expr) {
			case "Up":
				this.setState(prevState => ({
					points: prevState.points + 1,
					inBins: prevState.inBins + 1
				}));
				break;
			case "Down":
				this.setState(prevState => ({ points: prevState.points - 1 }));
				break;
			default:
				null;
		}
  };
  
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.gameInit >= 0;
  };

  resetGame = () => {
    window.location.reload();
  };

	render() {
		const {
			colorsForBins,
			spawnedBombs,
			currentBomb,
			points,
			inBins,
			removedBombs,
      changeIn,
      gameInit
		} = this.state;
    
		return (
			<div>
        <div style={timer}>Game: {gameInit}</div>
				<div style={score}>Diactivated: {inBins}</div>
          {gameInit === 0 ? 
            <div style={resetGameContainer}>
              <h1 style={titleStyle}>Game over</h1>
              <h2 style={titleStyle}>Total bombs: {spawnedBombs.length}</h2>
              <h2 style={titleStyle}>Total score: {points}</h2>
              <button style={btn} onClick={this.resetGame}>Start new game</button>
            </div> : <div></div>}
          {spawnedBombs.map((bomb, i) => (
            <Bomb
              key={bomb.id}
              id={bomb.id}
              topCoords={bomb.top} 
              leftCoords={bomb.left}
              setCurrentBomb={this.setCurrentBomb}
              setPoints={this.setPoints}
              removed={removedBombs.includes(bomb.id)}
              currentBomb={currentBomb}
              color={bomb.color}
              addToTheListOfDisplayedBombs={this.addToTheListOfDisplayedBombs}
              removeBombFromDisplayedList={this.removeBombFromDisplayedList}
              gameInit={gameInit}
            />
          ))}
				<div style={binContainer}>
					<Bin
						setPoints={this.setPoints}
						bomb={currentBomb}
            backgroundColor={colorsForBins[0]}
            gameInit={gameInit}
					/>
					<Bin
						setPoints={this.setPoints}
						bomb={currentBomb}
            backgroundColor={colorsForBins[1]}
            gameInit={gameInit}
					/>
					<Bin
						setPoints={this.setPoints}
						bomb={currentBomb}
            backgroundColor={colorsForBins[2]}
            gameInit={gameInit}
					/>
				</div>
				<div style={changeInContainer}><span style={changeInStyle}>Change in {changeIn}</span></div>
			</div>
		);
	}
}

export default App;
