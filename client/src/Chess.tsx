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
      <h2
        style={{
          color: '#e2e8f0',
          marginBottom: '10px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      >
        Chess Game
      </h2>

      <div
        style={{
          width: '400px',
          maxWidth: '90vw',
          padding: '20px',
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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

      <div
        style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={resetGame}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow =
              '0 6px 16px rgba(59, 130, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(59, 130, 246, 0.3)';
          }}
        >
          New Game
        </button>

        <div
          style={{
            fontSize: '14px',
            color: '#e2e8f0',
            textAlign: 'center',
            padding: '8px 12px',
            background: 'rgba(51, 65, 85, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            minWidth: '180px',
          }}
        >
          {game.isGameOver() ? (
            <span style={{ color: '#f87171', fontWeight: '500' }}>
              Game Over!{' '}
              {game.isCheckmate() ? 'Checkmate!' : game.isDraw() ? 'Draw!' : ''}
            </span>
          ) : (
            <span>
              {game.turn() === 'w' ? 'White' : 'Black'} to move
              {game.isCheck() && (
                <span style={{ color: '#fbbf24' }}> (Check!)</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChessGame;
