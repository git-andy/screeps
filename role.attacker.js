// Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,ATTACK,ATTACK],'attacker_'+Game.ticks, {memory: {role: 'attacker', working: false}});

var logger = require('common.logging');
var controller = require('creep.controller');
var helper = require('common.helper');

var roleAttacker = {

    run: function(creep) {
        var roomName = creep.memory.roomName; // Room where creep spawned
        if (creep.memory.targetRoom) // Target room for creep
        {
            roomName = creep.memory.targetRoom;
        }
        
        var target;
        if (roomName != creep.pos.roomName) {
            var room = Game.rooms[roomName];
            if (!room) {
                room = creep.room;
            }
            var targets = room.find(FIND_HOSTILE_CREEPS);
            
            target = targets[0];
        } else {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        }
        
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleAttacker;
