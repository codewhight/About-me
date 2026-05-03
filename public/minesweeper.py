import random
import js  # type: ignore  # Pyodide specific import for browser interaction 

class MinesweeperGame:
    def __init__(self):
        self.width = 9
        self.height = 9
        self.mines = 10
        self.board = None
        self.revealed = None
        self.game_over = False
        self.game_won = False
        self.init_game()

    def init_game(self):
        self.board = [[' ' for _ in range(self.width)] for _ in range(self.height)]
        self.revealed = [[False for _ in range(self.width)] for _ in range(self.height)]
        self.game_over = False
        self.game_won = False

        # Place mines
        mine_positions = random.sample(range(self.width * self.height), self.mines)
        for pos in mine_positions:
            x = pos % self.width
            y = pos // self.width
            self.board[y][x] = '*'

    def count_adjacent_mines(self, x, y):
        count = 0
        for dy in [-1, 0, 1]:
            for dx in [-1, 0, 1]:
                if dx == 0 and dy == 0:
                    continue
                nx, ny = x + dx, y + dy
                if 0 <= nx < self.width and 0 <= ny < self.height:
                    if self.board[ny][nx] == '*':
                        count += 1
        return count

    def reveal_cell(self, x, y):
        if self.revealed[y][x] or self.game_over or self.game_won:
            return

        self.revealed[y][x] = True

        if self.board[y][x] == '*':
            self.game_over = True
            return 'mine'

        mines = self.count_adjacent_mines(x, y)
        if mines == 0:
            # Reveal adjacent cells
            for dy in [-1, 0, 1]:
                for dx in [-1, 0, 1]:
                    if dx == 0 and dy == 0:
                        continue
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < self.width and 0 <= ny < self.height:
                        self.reveal_cell(nx, ny)
        return mines

    def check_win(self):
        hidden_count = sum(row.count(False) for row in self.revealed)
        return hidden_count == self.mines

    def get_board_html(self):
        html = '<div class="minesweeper-board">'
        for y in range(self.height):
            html += '<div class="row">'
            for x in range(self.width):
                cell_class = 'cell'
                content = ''
                if self.revealed[y][x]:
                    if self.board[y][x] == '*':
                        cell_class += ' mine'
                        content = '💣'
                    else:
                        mines = self.count_adjacent_mines(x, y)
                        if mines > 0:
                            content = str(mines)
                            cell_class += f' number-{mines}'
                        else:
                            cell_class += ' empty'
                else:
                    cell_class += ' hidden'

                html += f'<div class="{cell_class}" data-x="{x}" data-y="{y}" onclick="handleMinesweeperClick({x}, {y})">{content}</div>'
            html += '</div>'
        html += '</div>'
        return html

# Global game instance
game = None

def init_minesweeper():
    global game
    game = MinesweeperGame()
    return game.get_board_html()

def handle_click(x, y):
    global game
    if not game:
        return init_minesweeper()

    result = game.reveal_cell(x, y)

    if result == 'mine':
        # Reveal all mines
        for yy in range(game.height):
            for xx in range(game.width):
                if game.board[yy][xx] == '*':
                    game.revealed[yy][xx] = True
        js.alert('踩到地雷了！遊戲結束。')
    elif game.check_win():
        js.alert('恭喜！你贏了！')

    return game.get_board_html()

# Add CSS styles
css = '''
<style>
.minesweeper-board {
    display: inline-block;
    border: 2px solid #333;
    background: #fff;
}
.row {
    display: flex;
}
.cell {
    width: 30px;
    height: 30px;
    border: 1px solid #999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
}
.cell.hidden {
    background: #ddd;
}
.cell.hidden:hover {
    background: #bbb;
}
.cell.mine {
    background: #f00;
    color: white;
}
.cell.empty {
    background: #eee;
}
.cell.number-1 { color: blue; }
.cell.number-2 { color: green; }
.cell.number-3 { color: red; }
.cell.number-4 { color: purple; }
.cell.number-5 { color: maroon; }
.cell.number-6 { color: turquoise; }
.cell.number-7 { color: black; }
.cell.number-8 { color: gray; }
</style>
'''

js.document.head.insertAdjacentHTML('beforeend', css)

def restart_game():
    global game
    game = MinesweeperGame()
    return game.get_board_html()