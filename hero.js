/* eslint no-unused-vars: 0 */
/*

Strategies for the hero are contained within the "moves" object as
name-value pairs, like so:

    //...
    ambusher : function(gamedData, helpers){
      // implementation of strategy.
    },
    heWhoLivesToFightAnotherDay: function(gamedData, helpers){
      // implementation of strategy.
    },
    //...other strategy definitions.

The "moves" object only contains the data, but in order for a specific
strategy to be implemented we MUST set the "move" variable to a
definite property.  This is done like so:

move = moves.heWhoLivesToFightAnotherDay;

You MUST also export the move function, in order for your code to run
So, at the bottom of this code, keep the line that says:

module.exports = move;

The "move" function must return "North", "South", "East", "West", or "Stay"
(Anything else will be interpreted by the game as "Stay")

The "move" function should accept two arguments that the website will be passing in:
- a "gameData" object which holds all information about the current state
  of the battle
- a "helpers" object, which contains useful helper functions
- check out the helpers.js file to see what is available to you

*/

// Set our heros strategy and export the move function here
module.exports = function(gameData, helpers) {
    var hero = gameData.activeHero;
    var dft = hero.distanceFromTop;
    var dfl = hero.distanceFromLeft;
    var moves = {
        Stay: 0,
        North: 0,
        East: 0,
        South: 0,
        West: 0
    };

    //grave robbing
    var nearestGrave = helpers.findNearestObjectDirectionAndDistance(gameData.board, hero, function(tile) {
        return tile.type === 'Unoccupied' && tile.subType && tile.subType.includes('Fainted');
    });
    if (nearestGrave) {
        if (nearestGrave.distance == 1 && hero.health > 50) {
            if (hero.health > 75) {
			    //just rob the damn grave if we're next to one & feeling good!
			    return nearestGrave.direction;
            }
            moves[nearestGrave.direction] += 10000/(101 - hero.health);
        } else {
            moves[nearestGrave.direction] += 500/nearestGrave.distance;
        }
    }

    //diamond mines (careful as it'll cost 20hp to take a mine)
    var nearestMine = helpers.findNearestObjectDirectionAndDistance(gameData.board, hero, function(tile) {
        if (tile.type === 'DiamondMine') {
            return tile.owner ? tile.owner.id !== hero.id : true;
        }
    });
    if (nearestMine) {
        moves[nearestMine.direction] += (hero.health * 2.5) / (nearestMine.distance ? nearestMine.distance : 1);
    }

    //attacking enemies (i.e. enemy is adjacent)
    for (var dir in moves) {
        var tile = helpers.getTileNearby(gameData.board, dft, dfl, dir);
        if (tile && tile.type === 'Hero' && tile.team !== hero.team) {
            if (tile.health <= 30 && hero.health > 50)
                moves[dir] += (hero.health - tile.health) * 10;
            else
                moves[dir] += (hero.health - tile.health) * 3;
        }
    }

    //chasing enemies (i.e. moving towards)

    //replenishing health
    var nearestHealth = helpers.findNearestObjectDirectionAndDistance(gameData.board, hero, function(tile) {
        return tile.type === 'HealthWell';
    });
    if (nearestHealth) {
        var healthNeed = Math.pow((100-hero.health)/10, 4);
        if (nearestHealth.distance == 1 && hero.health < 71) {
            //stop comparing and just replenish health!
            return nearestHealth.direction;
        }
        moves[nearestHealth.direction] += healthNeed * (nearestHealth.distance + 1);
    }

    //helping others

    //impassable tiles
    //(gets a value of zero, if we can't move there)


    var direction,
    value = -10000;
    for (dir in moves) {
    if (moves[dir] > value) {
    direction = dir;
    value = moves[dir];
    }
    }

    return direction;
};
