var logger = require('common.logging');
var controller = require('creep.controller');
var workermanager = require('creep.workermanager');
var helper = require('common.helper');
var homeRoom = require('consts.room.home');


var roleExplorer = {
    run: function(creep) {
        var remoteRoom = Game.rooms[creep.memory.targetRoom];
        var remotePos = new RoomPosition(20, 20, creep.memory.targetRoom);
        if (creep.room.name != creep.memory.targetRoom)
        {
            creep.memory.action = 'moving to remote room ' + remotePos;
            controller.move(creep,remotePos);
        } else {
            if (!Game.rooms[creep.memory.targetRoom].controller.my)
            {
                console.log('ROLE.EXPLORER Going after controller ' + creep.room.controller);
                creep.memory.action = 'attempting claim';
                var claimResult = creep.claimController(creep.room.controller);
                console.log('ROLE.EXPLORER claim result ' + claimResult);
                if(claimResult == ERR_NOT_IN_RANGE) {
                    creep.memory.action = 'moving to controller';
                    creep.moveTo(creep.room.controller);
                    //controller.move(creep,remoteRoom.getControllerPoint());
                } else if (claimResult == ERR_NOT_OWNER) {
                    creep.memory.action = 'attacking controller';
                    creep.attackController(creep.room.controller);
                } else {
                    creep.memory.action = 'claiming controller';
                    creep.claimController(creep.room.controller);
                }
            } else {
                var hostileStructures = remoteRoom.find(FIND_HOSTILE_STRUCTURES);
                for(var structure in hostileStructures)
                {
                    //console.log('ROLE.EXPLORER Going after point ' + hostileStructures[structure].pos);
                    
                    if(creep.attack(hostileStructures[structure]) == ERR_NOT_IN_RANGE) {
                        creep.memory.action = 'moving to ' + hostileStructures[structure].pos;
                        creep.moveTo(hostileStructures[structure]);
                        //controller.move(creep,remoteRoom.getAttackPoint());
                    }     
                }
            }
        }
    }
};

module.exports = roleExplorer;