// 顯示遊戲頁面
export async function gamePage(InOrNot, login_user) {
    return `
     <html>
  <head><title>遊戲首頁</title></head>
  <body>
    <h1 style="text-align: center;">歡迎來到打磚頭遊戲</h1>

    <div style="text-align: center;">
      <h2>--- 遊戲規則 ---</h2>
    </div>

    <canvas id="gameCanvas" width="800" height="400" style="border:1px solid #000000; display: block; margin: 20px auto;"></canvas>

    <script>
      var canvas = document.getElementById("gameCanvas");
      var ctx = canvas.getContext("2d");

      // 設置字體和顏色
      ctx.font = 'bold 30px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';

      // 顯示遊戲標題
      ctx.fillText('遊戲方式', canvas.width / 2, 30);

      // 計算第一行文字的寬度
      var text1Width = ctx.measureText('透過左右鍵控制下方').width;
      var text2Width = ctx.measureText('藍色薄板').width;
      var totalWidth = text1Width + text2Width;

      // 計算起始位置
      var startX = (canvas.width - totalWidth) / 2;

      // 顯示第一行文字
      ctx.fillStyle = '#000000';
      ctx.fillText('透過左右鍵控制下方', startX + text1Width / 2, 90);
      ctx.fillStyle = '#0095DD';
      ctx.fillText('藍色薄板', startX + text1Width + text2Width / 2, 90);

      // 顯示第二行文字
      text1Width = ctx.measureText('擊打').width;
      text2Width = ctx.measureText('綠色小球').width;
      var text3Width = ctx.measureText('破壞').width;
      var text4Width = ctx.measureText('粉色磚塊').width;
      totalWidth = text1Width + text2Width + text3Width + text4Width;
      startX = (canvas.width - totalWidth) / 2;

      ctx.fillStyle = '#000000';
      ctx.fillText('擊打', startX + text1Width / 2, 150);
      ctx.fillStyle = "#009500";
      ctx.fillText('綠色小球', startX + text1Width + text2Width / 2, 150);
      ctx.fillStyle = '#000000';
      ctx.fillText('破壞', startX + text1Width + text2Width + text3Width / 2, 150);
      ctx.fillStyle = "#DD95DD";
      ctx.fillText('粉色磚塊', startX + text1Width + text2Width + text3Width + text4Width / 2, 150);

      // 畫圓和矩形
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 80, 170, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#009500";
      ctx.fill();
      ctx.closePath();
      
      ctx.beginPath();
      ctx.rect(canvas.width / 2 + 80, 160, 60, 10);
      ctx.fillStyle = "#DD95DD";
      ctx.fill();
      ctx.closePath();

      // 顯示第三行文字
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
      ctx.fillText('碰到下方邊緣', startX + text1Width + text2Width + text3Width / 2, 210);
    </script>

    <div style="text-align: center;">
      ${InOrNot ? 
        `<p>歡迎 ${login_user}， <a href="/game">繼續遊戲</a> </p> <a href="/logout">登出</a>` : 
        `<a href="/login">登入</a> <a href="/signup">註冊</a> `
      }
    </div>

  </body>
</html>


    `;
  }
  

  
  // 顯示註冊頁面
  export async function user_register() {
    return `
      <html>
        <body style="text-align: center;">
          <h1 >註冊頁面</h1>
          <form action="/signup" method="post">
            <label for="register_user">使用者名稱:</label><br>
            <input type="text" id="register_user" name="register_user"><br><br>
            <label for="register_password">密碼:</label><br>
            <input type="password" id="register_password" name="register_password"><br><br>
            <input type="submit" value="註冊">
          </form>
        </body>
      </html>
    `;
  }
  
  // 顯示登入頁面
  export async function user_login() {
    return `
      <html>
        <body style="text-align: center;">
          <h1>登入頁面</h1>
          <form action="/login" method="post">
            <label for="register_user">使用者名稱:</label><br>
            <input type="text" id="register_user" name="register_user"><br><br>
            <label for="register_password">密碼:</label><br>
            <input type="password" id="register_password" name="register_password"><br><br>
            <input type="submit" value="登入">
          </form>
        </body>
      </html>
    `;
  }
  
  