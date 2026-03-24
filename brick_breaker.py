import js  # type: ignore  # Pyodide specific import for browser interaction

class BrickBreakerGame:
    def __init__(self):
        self.canvas = None
        self.ctx = None
        self.ball = {'x': 200, 'y': 300, 'dx': 2, 'dy': -2, 'radius': 10}
        self.paddle = {'x': 150, 'y': 350, 'width': 100, 'height': 10}
        self.bricks = []
        self.score = 0
        self.game_over = False
        self.game_won = False
        self.animation_id = None

        # Initialize bricks
        for row in range(5):
            for col in range(8):
                brick = {
                    'x': col * 50 + 25,
                    'y': row * 20 + 50,
                    'width': 45,
                    'height': 15,
                    'visible': True
                }
                self.bricks.append(brick)

    def init_canvas(self):
        container = js.document.getElementById('brick_breaker-container')
        container.innerHTML = '''
            <h4>打磚塊</h4>
            <canvas id="game-canvas" width="400" height="400" style="border: 1px solid #333;"></canvas>
            <p>分數: <span id="score">0</span></p>
            <p>使用滑鼠移動球拍</p>
            <button onclick="startBrickBreaker()">開始遊戲</button>
        '''
        self.canvas = js.document.getElementById('game-canvas')
        self.ctx = self.canvas.getContext('2d')

    def draw(self):
        self.ctx.clearRect(0, 0, 400, 400)

        # Draw ball
        self.ctx.beginPath()
        self.ctx.arc(self.ball['x'], self.ball['y'], self.ball['radius'], 0, 2 * 3.14159)
        self.ctx.fillStyle = '#3498db'
        self.ctx.fill()
        self.ctx.closePath()

        # Draw paddle
        self.ctx.fillStyle = '#e74c3c'
        self.ctx.fillRect(self.paddle['x'], self.paddle['y'], self.paddle['width'], self.paddle['height'])

        # Draw bricks
        self.ctx.fillStyle = '#27ae60'
        for brick in self.bricks:
            if brick['visible']:
                self.ctx.fillRect(brick['x'], brick['y'], brick['width'], brick['height'])

        # Update score
        score_element = js.document.getElementById('score')
        if score_element:
            score_element.textContent = self.score

    def update(self):
        if self.game_over or self.game_won:
            return

        # Move ball
        self.ball['x'] += self.ball['dx']
        self.ball['y'] += self.ball['dy']

        # Ball collision with walls
        if self.ball['x'] - self.ball['radius'] <= 0 or self.ball['x'] + self.ball['radius'] >= 400:
            self.ball['dx'] = -self.ball['dx']
        if self.ball['y'] - self.ball['radius'] <= 0:
            self.ball['dy'] = -self.ball['dy']

        # Ball collision with paddle
        if (self.ball['y'] + self.ball['radius'] >= self.paddle['y'] and
            self.ball['x'] >= self.paddle['x'] and
            self.ball['x'] <= self.paddle['x'] + self.paddle['width'] and
            self.ball['dy'] > 0):
            self.ball['dy'] = -self.ball['dy']

        # Ball collision with bricks
        for brick in self.bricks:
            if (brick['visible'] and
                self.ball['x'] >= brick['x'] and
                self.ball['x'] <= brick['x'] + brick['width'] and
                self.ball['y'] - self.ball['radius'] <= brick['y'] + brick['height'] and
                self.ball['y'] + self.ball['radius'] >= brick['y']):
                brick['visible'] = False
                self.ball['dy'] = -self.ball['dy']
                self.score += 10
                break

        # Check game over
        if self.ball['y'] > 400:
            self.game_over = True
            js.alert('遊戲結束！分數：' + str(self.score))

        # Check win
        visible_bricks = sum(1 for brick in self.bricks if brick['visible'])
        if visible_bricks == 0:
            self.game_won = True
            js.alert('恭喜獲勝！分數：' + str(self.score))

    def game_loop(self):
        self.update()
        self.draw()
        if not self.game_over and not self.game_won:
            self.animation_id = js.window.requestAnimationFrame(lambda: self.game_loop())

    def start_game(self):
        if self.animation_id:
            js.window.cancelAnimationFrame(self.animation_id)
        self.game_over = False
        self.game_won = False
        self.score = 0
        self.ball = {'x': 200, 'y': 300, 'dx': 2, 'dy': -2, 'radius': 10}
        self.paddle = {'x': 150, 'y': 350, 'width': 100, 'height': 10}
        # Reset bricks
        for row in range(5):
            for col in range(8):
                index = row * 8 + col
                self.bricks[index]['visible'] = True
        self.game_loop()

    def restart_game(self):
        self.__init__()
        self.init_canvas()