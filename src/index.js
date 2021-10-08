import React from "react";
import ReactDOM from "react-dom";
// import { unstable_concurrentAct } from "react-dom/test-utils";
import "./index.css";

function Square(props) {
  return (
    <button className={props.classes} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={`Square${i}`}
        classes={this.highlightSquare(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  highlightSquare(i) {
    if (!this.props.winningSquares) {
      return "square";
    }

    //if winningsquares exists then assign variables
    const [a, b, c] = this.props.winningSquares;

    if (a === i || b === i || c === i) {
      return "square highlighted";
    } else {
      return "square";
    }
  }

  createBoard() {
    let board = [];

    for (let i = 0; i < 3; ++i) {
      let columns = [];
      let whole = i * 3;

      for (let j = 0; j < 3; ++j) {
        columns.push(this.renderSquare(whole + j));
      }
      board.push(
        <div key={`Board-row${i}`} className="board-row">
          {columns}
        </div>
      );
    }

    return board;
  }

  render() {
    // console.log(this.props.winningSquares);
    return <div>{this.createBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      toggle: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          col: (i % 3) + 1,
          row: Math.floor(i / 3) + 1,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  toggleOrder() {
    this.setState({
      toggle: !this.state.toggle,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        const winner = {
          squares: [a, b, c],
          value: squares[a],
        };
        return winner;
      }
    }
    return null;
  }

  squaresFilled() {
    const current = this.state.history[this.state.history.length - 1];
    let noNulls = true;

    current.squares.forEach((square) => {
      if (square === null) {
        noNulls = false;
      }
    });

    //if all squares have a not null value, false is returned
    return noNulls;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " (" + step.col + "," + step.row + ")"
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={
              this.state.stepNumber === move
                ? { fontWeight: "bold" }
                : { fontWeight: "normal" }
            }
          >
            {desc}
          </button>
        </li>
      );
    });

    //reverse the order of keys
    moves.sort((a, b) => {
      if (this.state.toggle) {
        return a.key - b.key;
      } else {
        return b.key - a.key;
      }
    });

    let status;

    if (winner) {
      //check if winner
      status = "Winner: " + winner.value;
    } else if (this.squaresFilled()) {
      status = "Tie!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={winner ? winner.squares : null}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="toggle">
            <button
              className="toggle-button"
              onClick={() => this.toggleOrder()}
            >
              {this.state.toggle
                ? "Click for Descending"
                : "Click for Ascending"}
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
