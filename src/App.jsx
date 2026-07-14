import React, { useState, useCallback, useRef, useEffect } from 'react';
import Board from './components/Board/Board';
import Score from './components/Score/Score';
import PiecePreview from './components/NextPiece/PiecePreview';
import Controls from './components/Controls/Controls'; // we might change to bottom controls
import Settings from './components/Settings/Settings';
import GameOver from './components/GameOver/GameOver';
import PauseOverlay from './components/PauseOverlay/PauseOverlay';
import TouchControls from './components/TouchControls/TouchControls';

import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudio } from './hooks/useAudio';

import { createBoard, calculateGhostPosition } from './utils/helpers';
import { checkCollision } from './utils/collision';
import { rotate } from './utils/rotation';
import { getNextPieces } from './utils/bagRandomizer';
import { calculateScore } from './utils/score';
import { TETROMINOES } from './utils/tetrominoes';
import { GAME_STATE, INITIAL_DROP_TIME, MIN_DROP_TIME, DROP_TIME_DECREMENT, BOARD_WIDTH } from './utils/constants';

function App() {
  const [board, setBoard] = useState(createBoard());
  const [piece, setPiece] = useState(null);
  const [nextPieces, setNextPieces] = useState([]);
  const [holdPiece, setHoldPiece] = useState(null);
  const [canHold, setCanHold] = useState(true);
  
  const [gameState, setGameState] = useState(GAME_STATE.START);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [isBackToBack, setIsBackToBack] = useState(false);
  const [dropTime, setDropTime] = useState(null);
  
  const [hardDropStreak, setHardDropStreak] = useState(null);
  const [isHardDropping, setIsHardDropping] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const [highScore, setHighScore] = useState(0);
  const [settings, setSettings] = useLocalStorage('tron-tetris-settings', { sound: true, particles: 'high' });

  const particleRef = useRef();
  const audio = useAudio(settings);

  // Responsive state for small screens (to show touch controls)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (gameState === GAME_STATE.START) {
      startGame();
    }
  }, [gameState]);

  const startGame = () => {
    const pieces = getNextPieces([]);
    const firstPieceType = pieces[0];
    
    setBoard(createBoard());
    setPiece({
      pos: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      shape: TETROMINOES[firstPieceType].shape,
      type: firstPieceType
    });
    setNextPieces(pieces.slice(1));
    setHoldPiece(null);
    setCanHold(true);
    setScore(0);
    setLines(0);
    setLevel(1);
    setCombo(0);
    setIsBackToBack(false);
    setDropTime(INITIAL_DROP_TIME);
    setGameState(GAME_STATE.PLAYING);
  };

  const spawnNextPiece = useCallback((currentHoldPiece = null, useHold = false) => {
    let nextPieceType;
    let newNextPieces = nextPieces;

    if (useHold && currentHoldPiece) {
      nextPieceType = currentHoldPiece;
    } else {
      newNextPieces = getNextPieces(nextPieces);
      nextPieceType = newNextPieces[0];
      setNextPieces(newNextPieces.slice(1));
    }

    const newPiece = {
      pos: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      shape: TETROMINOES[nextPieceType].shape,
      type: nextPieceType
    };

    if (checkCollision(newPiece, board, { x: 0, y: 0 })) {
      setGameState(GAME_STATE.GAME_OVER);
      setDropTime(null);
      audio.playGameover();
      if (score > highScore) setHighScore(score);
    } else {
      setPiece(newPiece);
    }
  }, [nextPieces, board, score, highScore, setHighScore, audio]);

  const handleHoldPiece = () => {
    if (!canHold || gameState !== GAME_STATE.PLAYING || isHardDropping || isClearing) return;
    
    const currentType = piece.type;
    const currentHold = holdPiece;
    
    setHoldPiece(currentType);
    setCanHold(false);
    
    spawnNextPiece(currentHold, !!currentHold);
  };

  const movePiece = (dir) => {
    if (isHardDropping || isClearing) return;
    if (!checkCollision(piece, board, { x: dir, y: 0 })) {
      setPiece(prev => ({ ...prev, pos: { x: prev.pos.x + dir, y: prev.pos.y } }));
      audio.playMove();
    }
  };

  const drop = () => {
    if (isHardDropping || isClearing) return;
    if (!checkCollision(piece, board, { x: 0, y: 1 })) {
      setPiece(prev => ({ ...prev, pos: { x: prev.pos.x, y: prev.pos.y + 1 } }));
    } else {
      if (piece.pos.y < 1) {
        setGameState(GAME_STATE.GAME_OVER);
        setDropTime(null);
        audio.playGameover();
        if (score > highScore) setHighScore(score);
        return;
      }
      updateBoard(piece);
    }
  };

  const hardDrop = () => {
    if (isHardDropping || isClearing) return;
    const dropDistance = calculateGhostPosition(piece, board);
    setHardDropStreak({ x: piece.pos.x + Math.floor(piece.shape[0].length/2), y: dropDistance });
    
    setIsHardDropping(true);
    setPiece(prev => ({ ...prev, pos: { x: prev.pos.x, y: prev.pos.y + dropDistance } }));
    
    setTimeout(() => {
      audio.playHardDrop();
      updateBoard({ ...piece, pos: { x: piece.pos.x, y: piece.pos.y + dropDistance } });
      setHardDropStreak(null);
      setIsHardDropping(false);
      if (particleRef.current) {
         particleRef.current.emitExplosion(
           (piece.pos.x + 1) * 30, 
           (piece.pos.y + dropDistance + 1) * 30, 
           TETROMINOES[piece.type].color,
           40
         );
      }
    }, 100);
  };

  const rotatePiece = (dir) => {
    if (isHardDropping || isClearing) return;
    const rotatedPiece = rotate(piece, board, dir);
    if (rotatedPiece !== piece) {
      setPiece(rotatedPiece);
      audio.playRotate();
      
      if (particleRef.current) {
        particleRef.current.emitExplosion(
          (piece.pos.x + 1) * 30, 
          (piece.pos.y + 1) * 30, 
          TETROMINOES[piece.type].color,
          10
        );
      }
    }
  };

  const updateBoard = (lockedPiece) => {
    const newBoard = board.map(row => [...row]);
    
    lockedPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = y + lockedPiece.pos.y;
          const boardX = x + lockedPiece.pos.x;
          if (boardY >= 0 && boardY < 20) {
            newBoard[boardY][boardX] = [lockedPiece.type, 'locked'];
          }
        }
      });
    });

    const linesToClear = [];
    newBoard.forEach((row, y) => {
      if (row.findIndex(cell => cell[0] === 0) === -1) {
        linesToClear.push(y);
      }
    });

    if (linesToClear.length > 0) {
      setIsClearing(true);
      linesToClear.forEach(y => {
        newBoard[y] = newBoard[y].map(cell => [cell[0], 'clear-anim']);
      });
      setBoard(newBoard);
      
      if (linesToClear.length === 4) audio.playTetris();
      else audio.playLineClear();
      
      setTimeout(() => {
        let linesCleared = 0;
        const finalBoard = newBoard.reduce((acc, row, y) => {
          if (linesToClear.includes(y)) {
            linesCleared += 1;
            acc.unshift(new Array(BOARD_WIDTH).fill([0, 'clear']));
            if (particleRef.current) {
              particleRef.current.emitLineClear(y * 30, 300, TETROMINOES[lockedPiece.type].color);
            }
          } else {
            acc.push(row);
          }
          return acc;
        }, []);

        const { scoreAdded, isBackToBack: newB2B } = calculateScore(linesCleared, level, combo, isBackToBack, false);
        setScore(prev => prev + scoreAdded);
        setIsBackToBack(newB2B);
        setCombo(prev => prev + 1);
        setLines(prev => prev + linesCleared);
        
        const newLevel = Math.floor((lines + linesCleared) / 10) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          setDropTime(Math.max(MIN_DROP_TIME, INITIAL_DROP_TIME - (newLevel - 1) * DROP_TIME_DECREMENT));
        }

        setBoard(finalBoard);
        setCanHold(true);
        setIsClearing(false);
        spawnNextPiece();
      }, 400);
    } else {
      setCombo(0);
      audio.playDrop();
      setBoard(newBoard);
      setCanHold(true);
      spawnNextPiece();
    }
  };

  useGameLoop(drop, dropTime, gameState === GAME_STATE.PLAYING && !isClearing && !isHardDropping);

  const pauseGame = () => {
    if (gameState === GAME_STATE.PLAYING) {
      setGameState(GAME_STATE.PAUSED);
      setDropTime(null);
    } else if (gameState === GAME_STATE.PAUSED) {
      setGameState(GAME_STATE.PLAYING);
      setDropTime(Math.max(MIN_DROP_TIME, INITIAL_DROP_TIME - (level - 1) * DROP_TIME_DECREMENT));
    }
  };

  useKeyboard(gameState, {
    move: movePiece,
    drop,
    rotate: rotatePiece,
    hardDrop,
    holdPiece: handleHoldPiece,
    pauseGame
  });

  const displayBoard = board;
  const ghostY = piece ? piece.pos.y + calculateGhostPosition(piece, board) : 0;

  // Hold and Next Panels
  const holdPanel = (
    <PiecePreview 
      title="HOLD" 
      type={holdPiece} 
      pieceShape={holdPiece ? TETROMINOES[holdPiece].shape : null} 
      isSquare
    />
  );

  const nextPanel = (
    <div className="glass-panel" style={{ padding: '1rem 0.5rem' }}>
      <div className="panel-title">NEXT</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {nextPieces.slice(0, 3).map((type, i) => (
          <PiecePreview 
            key={i}
            type={type} 
            pieceShape={TETROMINOES[type].shape} 
            mini
            noPanel
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="background-scene">
      <div className="perspective-grid" />
      <div className="ambient-glow" />
      <div className="scanlines" />
      
      <div className="app-container">
        
        {/* TOP ROW: STATS */}
        <div className="top-stats-row">
          <Score score={score} lines={lines} level={level} highScore={highScore} />
        </div>

        {/* MIDDLE ROW: GAME AREA */}
        <div className="middle-game-area">
          
          {/* Left: Hold */}
          {holdPanel}

          {/* Center: Board */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Board 
              board={displayBoard}
              piece={piece}
              ghostY={ghostY}
              isHardDropping={isHardDropping}
              gameState={gameState}
              particleRef={particleRef} 
              hardDropStreak={hardDropStreak} 
              particleDensity={settings.particles}
            />
          </div>

          {/* Right: Next */}
          {nextPanel}

        </div>

        {/* BOTTOM ROW: MINIMAL CONTROLS (Replacing full desktop controls panel) */}
        <div className="bottom-controls-row">
          <TouchControls 
            move={movePiece} 
            drop={drop} 
            rotate={rotatePiece} 
            hardDrop={hardDrop} 
            holdPiece={handleHoldPiece} 
            gameState={gameState}
            pauseGame={pauseGame}
            isMobile={isMobile}
          />
        </div>

      </div>

      {gameState === GAME_STATE.GAME_OVER && <GameOver score={score} restartGame={startGame} />}
      {gameState === GAME_STATE.PAUSED && <PauseOverlay resumeGame={pauseGame} />}
    </div>
  );
}

export default App;
