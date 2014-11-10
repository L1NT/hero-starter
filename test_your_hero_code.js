/*

If you'd like to test your hero code locally,
run this code using node (must have node installed).

Please note that you DO NOT need to do this to enter javascript
battle, it is simply an easy way to test whether your new hero
code will work in the javascript battle.

To run:

  -Install node
  -Run the following in your terminal:

    node test_your_hero_code.js

  -If you don't see any errors in your terminal, the code works!

*/

//Get the helper file and the Game logic
var helpers = require('./helpers.js');
var Game = require('./game_logic/Game.js');

//Get my hero's move function ("brain")
var heroMoveFunction = require('./hero.js');

var SIZE = 20;
function rand(max) {
  max = max || SIZE;
  return Math.floor(Math.random()*max);
}

//The move function ("brain") the practice enemy will use
var enemyMoveFunction = function(gameData, helpers) {
  //Move in a random direction
  var choices = ['North', 'South', 'East', 'West'];
  return choices[rand(4)];
}

//Makes a new game with a 5x5 board
var game = new Game(SIZE);

//Add a health wells
for (var i=0,len=rand(5)+5;i<len;i++) {
  game.addHealthWell(rand(),rand());
}

//Add diamond mines
for (var i=0,len=rand(5)+5;i<len;i++) {
  game.addDiamondMine(rand(),rand());
}

//Add heroes
game.addHero(rand(), rand(), 'MyHero', 0);
game.addHero(rand(), rand(), 'EnemyH01', 1);
game.addHero(rand(), rand(), 'TeammateH02', 0);
game.addHero(rand(), rand(), 'EnemyH03', 1);
game.addHero(rand(), rand(), 'TeammateH04', 0);
game.addHero(rand(), rand(), 'EnemyH05', 1);
game.addHero(rand(), rand(), 'TeammateH06', 0);
game.addHero(rand(), rand(), 'EnemyH07', 1);
game.addHero(rand(), rand(), 'TeammateH08', 0);
game.addHero(rand(), rand(), 'EnemyH09', 1);
game.addHero(rand(), rand(), 'TeammateH10', 0);
game.addHero(rand(), rand(), 'EnemyH11', 1);

console.log('About to start the game!  Here is what the board looks like:');

//You can run game.board.inspect() in this test code at any time
//to log out the current state of the board (keep in mind that in the actual
//game, the game object will not have any functions on it)
game.board.inspect();

//Play a very short practice game
var turnsToPlay = 250;

for (var i=0; i<turnsToPlay; i++) {
  var hero = game.activeHero;
  var direction;
  if (hero.name === 'MyHero') {
    //Ask your hero brain which way it wants to move
    direction = heroMoveFunction(game, helpers);
  } else {
    direction = enemyMoveFunction(game, helpers);
  }
  console.log('-----');
  console.log('Turn ' + i + ':');
  console.log('-----');
  console.log(hero.name + ' tried to move ' + direction);
  console.log(hero.name + ' owns ' + hero.mineCount + ' diamond mines')
  console.log(hero.name + ' has ' + hero.health + ' health')
  if (hero.name === 'MyHero')
    game.board.inspect();
  game.handleHeroTurn(direction);
}

//game.board.inspect();
