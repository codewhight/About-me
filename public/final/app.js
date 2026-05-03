import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { gameContent } from './game.js';

const db = new DB("game.db");
let InOrNot = false;
let login_user = "";



db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, password TEXT, score TEXT)");

const router = new Router();

router
  .get('/', home)
  .get('/game', game)
  .get('/signup', signupUi)
  .post('/signup', signup)
  .get('/login', login_Ui)
  .post('/login', login)
  .get('/logout', logout)
  

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());



async function home(ctx) 
{
  ctx.response.body = await render.gamePage(InOrNot, login_user);
}


async function game(ctx) 
{
  ctx.state.login_user = login_user;
  ctx.response.body = gameContent;
}

function query(sql) 
{
    let list1 = [];
    for (const [id, user, score] of db.query(sql)) 
    {
        list1.push({ id, user, score});
    }
    return list1;
}

async function signupUi(ctx)
{
  ctx.response.body = await render.user_register(); 
}

async function signup(ctx) {
  const body = ctx.request.body;

  if (body.type() === "form")
  {
    const pairs = await body.form()
    const user = {}

    for (const [key, value] of pairs) 
    {
      user[key] = value
    }

    console.log("new user:", user);

    db.query("INSERT INTO users (user, password) VALUES (?, ?)", [user.register_user, user.register_password]);

    ctx.response.redirect(`/`);
  } 
  else 
  {
    ctx.response.status = 400;
    ctx.response.body = "Expected form data.";
  }
}

async function login_Ui(ctx)
{
  ctx.response.body = await render.user_login(); 
}

async function parseFormBody(body) 
{
  const pairs = await body.form()
  const obj = {}

  for (const [key, value] of pairs) 
  {
    obj[key] = value
  }

  return obj
}

async function login(ctx) 
{
  const body = ctx.request.body;

  if (body.type() === "form")
  {
    var user = await parseFormBody(body)
    console.log('user=', user);
    var db_user = db.query(`SELECT user, password FROM users WHERE user = '${user.register_user}'`);
    console.log("db_user:" , db_user[0][1]);

    if (user.register_password === db_user[0][1])
    {
      InOrNot = true;
      login_user = user.register_user;
      ctx.response.redirect(`/game`);
    }
  }
}

async function logout(ctx)
{
  InOrNot = false;
  login_user = "";
  ctx.response.redirect(`/`);
}



console.log(`Server running at http://127.0.0.1:8000`);
await app.listen({ port: 8000 });