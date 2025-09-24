import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

function ChessGame() {
  const [game, setGame] = useState(new Chess());

  function makeAMove(move: { from: string; to: string; promotion?: string }) {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    if (result) {
      setGame(gameCopy);
      return true;
    }
    return false;
  }

  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) {
    // If targetSquare is null, it's not a valid drop
    if (!targetSquare) return false;

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for simplicity
    });

    // illegal move
    if (move === false) return false;
    return true;
  }

  function resetGame() {
    const newGame = new Chess();
    setGame(newGame);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
      }}
    >
      <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Chess Game</h2>

      <div
        style={{
          width: '400px',
          maxWidth: '90vw',
        }}
      >
        <Chessboard
          options={{
            position: game.fen(),
            onPieceDrop: onPieceDrop,
            allowDragging: true,
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={resetGame}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          New Game
        </button>

        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          {game.isGameOver() ? (
            <span style={{ color: '#dc2626', fontWeight: '500' }}>
              Game Over!{' '}
              {game.isCheckmate() ? 'Checkmate!' : game.isDraw() ? 'Draw!' : ''}
            </span>
          ) : (
            <span>
              {game.turn() === 'w' ? 'White' : 'Black'} to move
              {game.isCheck() && (
                <span style={{ color: '#dc2626' }}> (Check!)</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChessGame;
