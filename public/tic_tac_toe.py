import js  # type: ignore  # Pyodide specific import for browser interaction

class TicTacToeGame:
    def __init__(self):
        self.board = [[' ' for _ in range(3)] for _ in range(3)]
        self.current_player = 'X'
        self.game_over = False
        self.winner = None

    def make_move(self, x, y):
        if self.game_over or self.board[y][x] != ' ':
            return False

        self.board[y][x] = self.current_player
        self.check_winner()
        if not self.game_over:
            self.current_player = 'O' if self.current_player == 'X' else 'X'
        return True

    def check_winner(self):
        # Check rows
        for row in self.board:
            if row[0] == row[1] == row[2] != ' ':
                self.game_over = True
                self.winner = row[0]
                return

        # Check columns
        for col in range(3):
            if self.board[0][col] == self.board[1][col] == self.board[2][col] != ' ':
                self.game_over = True
                self.winner = self.board[0][col]
                return

        # Check diagonals
        if self.board[0][0] == self.board[1][1] == self.board[2][2] != ' ':
            self.game_over = True
            self.winner = self.board[0][0]
            return
        if self.board[0][2] == self.board[1][1] == self.board[2][0] != ' ':
            self.game_over = True
            self.winner = self.board[0][2]
            return

        # Check for tie
        if all(cell != ' ' for row in self.board for cell in row):
            self.game_over = True
            self.winner = 'tie'

    def get_board_html(self):
        html = '<div class="tic-tac-toe-board">'
        for y in range(3):
            html += '<div class="row">'
            for x in range(3):
                cell_class = 'cell'
                content = self.board[y][x] if self.board[y][x] != ' ' else ''
                if self.board[y][x] == 'X':
                    cell_class += ' x'
                elif self.board[y][x] == 'O':
                    cell_class += ' o'
                else:
                    cell_class += ' empty'
                html += f'<div class="{cell_class}" data-x="{x}" data-y="{y}" onclick="handleTicTacToeClick({x}, {y})">{content}</div>'
            html += '</div>'
        html += '</div>'
        return html

    def get_status_message(self):
        if self.game_over:
            if self.winner == 'tie':
                return '平手！'
            else:
                return f'玩家 {self.winner} 獲勝！'
        else:
            return f'輪到玩家 {self.current_player}'

# Global game instance
game = None

def init_tic_tac_toe():
    global game
    game = TicTacToeGame()
    return game.get_board_html()

def handle_click(x, y):
    global game
    if not game:
        return init_tic_tac_toe()

    if game.make_move(x, y):
        return game.get_board_html()
    return game.get_board_html()

def get_game_status():
    global game
    if game:
        return game.get_status_message()
    return "遊戲未初始化"

# Add CSS styles
css = '''
<style>
.tic-tac-toe-board {
    display: inline-block;
    border: 3px solid #333;
    background: #fff;
}
.row {
    display: flex;
}
.cell {
    width: 60px;
    height: 60px;
    border: 2px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
}
.cell.empty:hover {
    background: #f0f0f0;
}
.cell.x {
    color: #e74c3c;
}
.cell.o {
    color: #3498db;
}
</style>
'''

js.document.head.insertAdjacentHTML('beforeend', css)

def restart_game():
    global game
    game = TicTacToeGame()
    return game.get_board_html()