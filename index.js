document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');
    const aiButton = document.getElementById('aiButton');
    const xScoreDisplay = document.getElementById('xScore');
    const oScoreDisplay = document.getElementById('oScore');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let xScore = 0;
    let oScore = 0;

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);
    aiButton.addEventListener('click', startAIGame);

    function startAIGame() {
        console.log("Starting AI Game...");
        resetGame();
    }

    function handleCellClick(event) {
        const cell = event.target;
        const index = cell.getAttribute('data-index');

        if (board[index] === '' && currentPlayer === 'X') {
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase());
            checkWinner();
            currentPlayer = 'O';
            statusDisplay.textContent = `Current Player: ${currentPlayer}`;
            makeAIMove();
        }
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                updateScore(board[a]);
                statusDisplay.textContent = `${board[a]} Wins!`;
                return;
            }
        }

        if (!board.includes('')) {
            statusDisplay.textContent = 'It\'s a Draw!';
        }
    }

    function updateScore(winner) {
        if (winner === 'X') {
            xScore++;
            xScoreDisplay.textContent = xScore;
        } else {
            oScore++;
            oScoreDisplay.textContent = oScore;
        }
        setTimeout(resetGame, 2000);
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        statusDisplay.textContent = `Current Player: ${currentPlayer}`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }

    async function makeAIMove() {
        try {
            const url = 'https://api.blackbox.ai/api/chat';
            const data = {
                messages: [{
                    content: `Current Tic-Tac-Toe board: ${JSON.stringify(board)}. As player O, choose an empty cell (0-8). Respond ONLY with the number.`,
                    role: 'user'
                }],
                model: 'deepseek-ai/DeepSeek-V3',
                max_tokens: '1024'
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post(url, data, config);
            const aiMove = parseInt(response.data.choices[0].message.content.trim());

            if (!isNaN(aiMove) && board[aiMove] === '') {
                board[aiMove] = currentPlayer;
                cells[aiMove].textContent = currentPlayer;
                cells[aiMove].classList.add(currentPlayer.toLowerCase());
                checkWinner();
                currentPlayer = 'X';
                statusDisplay.textContent = `Current Player: ${currentPlayer}`;
            }
        } catch (error) {
            console.error('AI Move failed:', error);
            makeRandomMove();
        }
    }

    function makeRandomMove() {
        const availableMoves = board
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);

        if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            board[randomMove] = currentPlayer;
            cells[randomMove].textContent = currentPlayer;
            cells[randomMove].classList.add(currentPlayer.toLowerCase());
            checkWinner();
            currentPlayer = 'X';
            statusDisplay.textContent = `Current Player: ${currentPlayer}`;
        }
    }
});