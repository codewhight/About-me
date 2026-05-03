
export const gameContent = 

           
    `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>Gamedev Canvas Workshop</title>
        <style>
        * {
            text-align: center;
            padding: 0;
            margin: 10;
        }
        canvas {
            background: #eee;
            display: block;
            margin: 0 auto;
        }
        </style>
    </head>
    <body>
        <h1>打磚頭遊戲</h1>
        <p>Score: <span id="score">0</span> Level: <span id="level">1</span></p>
        <canvas id="gamecanvas" width="500" height="350"></canvas>
        <button id="rungame">start game</button>
        <button id="newgame">new game</button>
        <button id="rules">game rules</button>
        <button id="BackHome">back home</button>
        
        <script>
            var intervalGame;
            var flagBrick = false;
            var scoreElement = document.getElementById('score');
            var levelElement = document.getElementById('level');
            var RulesButton = document.getElementById('rules');
            var BackhomeButton = document.getElementById('BackHome');
            var StartGameButton = document.getElementById('rungame');
            var UpscoreButton = document.getElementById('UpScore');
            var NewGameButton = document.getElementById('newgame');
            var flagover = false;
            var speed = 10;
            var canvas = document.getElementById('gamecanvas');
            var ctx = canvas.getContext("2d");
            var level = parseInt(levelElement.textContent);
            var temp = 0;
            var score = parseInt(scoreElement.textContent);

            //球的設定參數
            var x = canvas.width/2;
            var y = 200;
            const ballRadius = 10;
            var num = (Math.random() * 4) + 1;
            if(num > 2 || num == 0)
                num = 2 - num;
            var dx = num;
            var dy = 2;
            
            //板子的參數
            var paddleHeight = 10;
            var paddleWidth = 170;
            var paddleX = (canvas.width - paddleWidth - 10*score) / 2;

            //板子移動參數
            var rightPressed = false;
            var leftPressed = false;
            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);

            //磚頭參數
            var brickRowCount
            var brickColumnCount;
            var brickWidth = 60;
            var brickHeight = 20;
            var brickPadding = 10;
            var brickOffsetTop = 30;
            var brickOffsetLeft = 10;
            var bricks = [];

            for (let c = 0; c < brickColumnCount; c++)
            {
                bricks[c] = [];
                for (let r = 0; r < brickRowCount; r++) 
                {
                    bricks[c][r] = { x: 0, y: 0, status: 1};//statu 是否顯示於螢幕上
                }
            }
        
            function keyDownHandler(e) 
            {
                if (e.key == "Right" || e.key == "ArrowRight") 
                {
                    rightPressed = true;
                }
                else if (e.key == "Left" || e.key == "ArrowLeft")
                {
                    leftPressed = true;
                }
            }

            function keyUpHandler(e)
            {
                if (e.key == "Right" || e.key == "ArrowRight") 
                {
                    rightPressed = false;
                } 
                else if (e.key == "Left" || e.key == "ArrowLeft") 
                {
                    leftPressed = false;
                }
            }


            
            function drawBall() //繪製球
            {
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI*2);
                ctx.fillStyle = "#009500";
                ctx.fill();
                ctx.closePath();
            }

            function drawPaddle() //繪製板子
            {
                
                ctx.beginPath();
                if(paddleWidth - (10 * temp) > 100)
                    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth - (10 * temp), paddleHeight);
                else if(paddleWidth - (10 * temp) <= 100)
                ctx.rect(paddleX, canvas.height - paddleHeight, 100, paddleHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }

            function drawBricks() //繪製磚頭
            {
                if(flagBrick)
                {
                    
                    for (let c = 0; c < brickColumnCount; c++) 
                    {
                        for (let r = 0; r < brickRowCount; r++) 
                        {
                            if(bricks[c][r].status == 1)
                            {
                                if(c % 2 == 0)
                                {
                                    if(r % 2 == 1)
                                    {
                                        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft ;
                                        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop ;
                                        bricks[c][r].x = brickX;
                                        bricks[c][r].y = brickY;
                                        ctx.beginPath();
                                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                                        ctx.fillStyle = "#DD95DD";
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    else
                                    {
                                        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                                        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop + 120;
                                        bricks[c][r].x = brickX;
                                        bricks[c][r].y = brickY;
                                        ctx.beginPath();
                                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                                        ctx.fillStyle = "#DD95DD";
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                }
                                else
                                {
                                    if(r % 2 == 1)
                                    {
                                        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft  ;
                                        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop + 50 ;
                                        bricks[c][r].x = brickX;
                                        bricks[c][r].y = brickY;
                                        ctx.beginPath();
                                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                                        ctx.fillStyle = "#DD95DD";
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    else
                                    {
                                        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft ;
                                        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop - 20;
                                        bricks[c][r].x = brickX;
                                        bricks[c][r].y = brickY;
                                        ctx.beginPath();
                                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                                        ctx.fillStyle = "#DD95DD";
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                }
                                
                            }
                        
                            
                        }
                    }
                }
                else
                {
                    for (let c = 0; c < brickColumnCount; c++) 
                    {
                        for (let r = 0; r < brickRowCount; r++) 
                        {
                            if(bricks[c][r].status == 1)
                            {
                                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                                bricks[c][r].x = brickX;
                                bricks[c][r].y = brickY;
                                ctx.beginPath();
                                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                                ctx.fillStyle = "#DD95DD";
                                ctx.fill();
                                ctx.closePath();
                            }
                            
                        }
                    }
                }
                
            }

            function collisionDetection() //檢測碰撞
            {
                for (let c = 0; c < brickColumnCount; c++) 
                {
                    for (let r = 0; r < brickRowCount; r++) 
                    {
                        const b = bricks[c][r];
                        if (b.status === 1) 
                        {
                            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) 
                            {
                                dy = -dy;
                                b.status = 0;
                                temp++;
                                score++;
                                scoreElement.textContent = score;
                                if(temp == brickRowCount * brickColumnCount)
                                {
                                    levelup();
                                    temp = 0;
                                }
                            }
                        }
                    }
                }
            }
            function play()
            {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                
                drawBall();
                drawPaddle();
                collisionDetection();
                drawBricks();
                
                
                    
                
                //球的移動
                if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) //判斷X軸範圍 處壁就反彈
                {
                    
                    dx = -dx;
                }

                if (y + dy < ballRadius) 
                {
                    dy = -dy;
                } 
                else if (y + dy > canvas.height - ballRadius) 
                {
                    if(paddleWidth - (10 * temp) > 100)
                    {
                        if (x > paddleX && x < paddleX + paddleWidth - (10 * temp)) 
                        {
                            dy = -dy;
                        } 
                        else 
                        {
                        flagover = true;
                            
                        }
                    }
                    else if(paddleWidth - (10 * temp) <= 100)
                    {
                        if (x > paddleX && x < paddleX + 100) 
                        {
                            dy = -dy;
                        } 
                        else 
                        {
                        flagover = true;
                        
                        }
                    }
                    
                }
            
                if(flagover)
                {
                    gameOver();
                    clearInterval(intervalGame);
                    clearInterval(intervalBrick);
                    
                }
                
                //板子的移動
                if (rightPressed) 
                {
                    if(paddleWidth - (10 * temp) > 100)
                        paddleX = Math.min(paddleX + 7, canvas.width - (paddleWidth - (10 * temp)));
                    else if(paddleWidth - (10 * temp) <= 100)
                    paddleX = Math.min(paddleX + 7, canvas.width - 100);
                }
                else if (leftPressed) 
                {
                    paddleX = Math.max(paddleX - 7, 0);
                }

                x += dx ;
                y += dy ;
                
                
            }
    
            function startGame() 
            {
                intervalGame = setInterval(play, 10);//每speed毫秒呼叫draw 
            }

            function gameOver() 
            {
                ctx.beginPath();
                ctx.font = 'bold 60px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
                ctx.closePath();
                x = x;
                y = y;
                paddleX = paddleX;
                NewGameButton.disabled = false;
                RulesButton.disabled = false;
                clearInterval(intervalGame);
                clearInterval(intervalBrick);
            }

            function setgame()
            {
                flagover = false;
                flagBrick = false;
                x = canvas.width/2;
                y = 200;
                score = 0;
                temp = 0;
                level = 1;
                speed = 10;
                levelset();
                scoreElement.textContent = score;
                levelElement.textContent = level;
                for (let c = 0; c < brickColumnCount; c++)
                {
                    bricks[c] = [];
                    for (let r = 0; r < brickRowCount; r++) 
                    {
                        bricks[c][r] = { x: 0, y: 0, status: 1};//statu 是否顯示於螢幕上
                    }
                }

                num = (Math.random() * 4) + 1;
                if(num > 2 )
                    num = 2 - num;

                dx = num;
                dy = 2;

                paddleWidth = 170;
                paddleX = (canvas.width - paddleWidth - 10 * score) / 2;

                
                
            }
            function levelset()
            {
                num = (Math.random() * 4) + 1;
                if(num > 2 )
                    num = 2 - num;
                dx = num;
                if(level % 3 == 1)
                {
                    flagBrick = false;
                    brickOffsetLeft = 30
                    brickRowCount = 3;
                    brickColumnCount = 5;
                    brickPadding = 10;
                    brickWidth = 80;
                    
                    for (let c = 0; c < brickColumnCount; c++)
                    {
                        bricks[c] = [];
                        for (let r = 0; r < brickRowCount; r++) 
                        {
                            bricks[c][r] = { x: 0, y: 0, status: 1};//statu 是否顯示於螢幕上
                        }
                    }
                }
                else if(level % 3 == 2)
                {
                    brickOffsetLeft = 20
                    brickRowCount = 5;
                    brickColumnCount = 7;
                    brickPadding = 10;
                    brickWidth = 57;
                    for (let c = 0; c < brickColumnCount; c++)
                    {
                        bricks[c] = [];
                        for (let r = 0; r < brickRowCount; r++) 
                        {
                            bricks[c][r] = { x: 0, y: 0, status: 1};//statu 是否顯示於螢幕上
                        }
                    }
                }
                else if(level % 3 == 0)
                {
                    brickOffsetLeft = 30
                    brickRowCount = 2;
                    brickColumnCount = 6;
                    brickPadding = 3;
                    brickWidth = 65;
                    
                    flagBrick = true;
                
                    for (let c = 0; c < brickColumnCount; c++)
                    {
                        bricks[c] = [];
                        for (let r = 0; r < brickRowCount; r++) 
                        {
                            bricks[c][r] = { x: 0, y: 0, status: 1};//statu 是否顯示於螢幕上
                        }
                    }
                }
            }
            function levelup()
            {
                x = canvas.width/2;
                y = 200;
                level++;
                levelElement.textContent = level;
                levelset();
            
            
            }
            
            function rule()
            {
                
                ctx.font = 'bold 30px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.fillText('遊戲方式', canvas.width / 2, 30);

                // 計算整體文本的寬度
                var text1Width = ctx.measureText('透過左右鍵控制下方').width;
                var text2Width = ctx.measureText('藍色薄板').width;
                var totalWidth = text1Width + text2Width;

                // 計算起始位置
                var startX = (canvas.width - totalWidth) / 2;

                ctx.beginPath();
                ctx.arc(canvas.width / 2 -80, 170, 10, 0, Math.PI*2);
                ctx.fillStyle = "#009500";
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.rect(canvas.width / 2 + 80, 160, 60, 10);
                ctx.fillStyle = "#DD95DD";
                ctx.fill();
                ctx.closePath();
                
                ctx.fillStyle = '#000000';
                text1Width = ctx.measureText('避免').width;
                text2Width = ctx.measureText('綠色小球').width;
                text3Width = ctx.measureText('碰到下方邊緣').width;

                totalWidth = ctx.measureText('避免綠色小球碰到下方邊緣').width;
                startX = (canvas.width - totalWidth) / 2;
                ctx.fillStyle = '#000000';
                ctx.fillText('避免', startX + text1Width / 2, 210);

                ctx.fillStyle = "#009500";
                ctx.fillText('綠色小球', startX + text1Width + text2Width / 2, 210);
                ctx.fillStyle = '#000000';
                ctx.fillText('碰到下方邊緣', startX +  text1Width + text2Width + text3Width / 2, 210);
                
                ctx.closePath();
            }
            StartGameButton.addEventListener("click", function () 
            {
                startGame();
                levelset();
                StartGameButton.disabled = true;
                NewGameButton.disabled= true;
                RulesButton.disabled = true
                
            });

            NewGameButton.addEventListener("click", function () 
            {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setgame();
                drawBall();
                drawPaddle();
                drawBricks();
                StartGameButton.disabled = false;

            });

            RulesButton.addEventListener("click", function () 
            {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                rule();
                drawPaddle();
            });

            BackhomeButton.addEventListener("click", function () 
            {
                window.location.href = '/';
            });

           


            
        </script>
    </body>
    </html>
    `;
