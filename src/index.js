import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        key={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  drawBoard = () => {
    const MAXROW = 3;
    const MAXCOL = 3;

    let rows = [];

    for(var i = 0; i < MAXROW; i++){
      let squares = [];
      for(var j = 0; j < MAXCOL; j++){
        squares.push(this.renderSquare(MAXCOL * i + j));
      }
      rows.push(<div key={i} className="board-row">{squares}</div>);
    }

    return rows;
  };

  render() {
    return (
      <div>
        {this.drawBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: 0,
        column: 0
      }],
      stepNumber: 0,
      xIsNext: true,
      orderAsc: true
    };
  }

  getRowColumn = (i) => {
    const pos = {
      row: 0,
      column: 0
    };

    switch (i) {
      case 0:
        pos.row = 0;
        pos.column = 0;  

        break;
      case 1:
        pos.row = 0;
        pos.column = 1;  

        break;
      case 2:
        pos.row = 0;
        pos.column = 2;  

        break;
      case 3:
        pos.row = 1;
        pos.column = 0;  

        break;
      case 4:
        pos.row = 1;
        pos.column = 1;  

        break;
      case 5:
        pos.row = 1;
        pos.column = 2;  

        break;
      case 6:
        pos.row = 2;
        pos.column = 0;  

        break;
      case 7:
        pos.row = 2;
        pos.column = 1;  

        break;
      case 8:
        pos.row = 2;
        pos.column = 2;  

        break;
      default:
        break;
    }

    return pos;
  };

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const pos = this.getRowColumn(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        row: pos.row,
        column: pos.column
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  changeOrder = () => {
    this.setState({
      history: this.state.history.reverse(),
      orderAsc: !this.state.orderAsc
    });
  };

  render() {
    const { 
      history,
      orderAsc
    } = this.state;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      let desc;
      
      if (orderAsc) {
        desc = move ? 
          `Go to move #${move} (${step.row}, ${step.column})`: 
          'Go to game start';
      }
      else {
        desc = (move !== history.length - 1) ? 
          `Go to move #${history.length - 1 - move} (${step.row}, ${step.column})`: 
          'Go to game start';
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className='sort-button' onClick={(moves) => this.changeOrder(moves)}>Change order</button>
          {orderAsc ? <ol>{moves}</ol> : <ol reversed={true}>{moves}</ol>}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}