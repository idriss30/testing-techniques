const Koa = require("koa");
const Router = require("koa-router");

//implementation doesn't focus on the database
const app = new Koa(),
  router = new Router();
let carts = new Map(); // store the application state

let inventory = new Map();

router.get("/carts/:username/:items", (ctx) => {
  const cart = carts.get(ctx.params.username);
  cart ? (ctx.body = cart) : (ctx.status = 404);
});

router.post("/carts/:username/items/:item", (ctx) => {
  const { username, item } = ctx.params;
  if (!inventory.get(item)) {
    ctx.status = 404;
    return;
  }
  inventory.set(item, inventory.get(item) - 1);
  const newItems = (carts.get(username) || []).concat(item);
  carts.set(username, newItems);
  ctx.body = carts.get(username);
});

router.delete("/carts/:username/items/:item", (ctx) => {
  const { username, item } = ctx.params;
  const newItems = (carts.get(username) || []).filter((i) => i !== item);
  carts.set(username, newItems);
  ctx.body = newItems;
});

const resetState = () => {
  carts = new Map();
};
app.use(router.routes());

module.exports = {
  app: app.listen(3000),
  resetState,
  inventory,
  carts,
};
