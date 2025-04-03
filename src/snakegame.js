import React, { useState, useEffect } from "react";

const gridSize = 20;
const initialSnake = [{ x: 10, y: 10 }];
const initialFood = { x: 5, y: 5 };

const SnakeGame = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowUp":
          setDirection("UP");
          break;
        case "ArrowDown":
          setDirection("DOWN");
          break;
        case "ArrowLeft":
          setDirection("LEFT");
          break;
        case "ArrowRight":
          setDirection("RIGHT");
          break;
        case " ": // Spacebar to pause
          setIsPaused((prev) => !prev);
          break;
        case "r": // 'R' key to restart
          restartGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        let head = { ...newSnake[0] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
          default:
            break;
        }

        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          setFood({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused]);

  const restartGame = () => {
    setSnake(initialSnake);
    setFood(initialFood);
    setDirection("RIGHT");
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Snake Game</h1>
      {gameOver ? <h2>Game Over! Press 'R' to Restart</h2> : null}
      {isPaused ? <h2>Game Paused! Press Space to Resume</h2> : null}
      <button onClick={() => setIsPaused((prev) => !prev)}>{isPaused ? "Resume" : "Pause"}</button>
      <button onClick={restartGame}>Restart</button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 20px)`,
          gridTemplateRows: `repeat(${gridSize}, 20px)`,
          gap: "2px",
          border: "2px solid black",
          width: "max-content",
          margin: "auto",
          touchAction: "none"
        }}
      >
        {[...Array(gridSize * gridSize)].map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: isSnake ? "green" : isFood ? "red" : "white",
                border: "1px solid lightgray",
              }}
            ></div>
          );
        })}
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setDirection("UP")}>⬆️</button><br />
        <button onClick={() => setDirection("LEFT")}>⬅️</button>
        <button onClick={() => setDirection("DOWN")}>⬇️</button>
        <button onClick={() => setDirection("RIGHT")}>➡️</button>
      </div>
    </div>
  );
};

export default SnakeGame;
