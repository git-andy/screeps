var logger = require('common.logging');
var helper = require('common.helper');
var controller = require('creep.controller');

var workermanager = {
    transferenergy: function(creep)
    {
        var target = creep.room.find(STRUCTURE_SPAWN);
        if (target.energy = target.energyCapacity)
        {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity; }
            });
        }
        if(target)
        {
            var transferResult = creep.transfer(target, RESOURCE_ENERGY);
            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.memory.action = 'transfering to structure [' + helper.whatstructureishere(target.pos) + ']';
                controller.move(creep, target);
                return true;
            }
        } 
        return false;
    },
    upgradecontroller: function(creep)
    {
        var roomName = 'E7N42';
        if (creep.memory.targetRoom)
        {
            //console.log('Getting roomName from targetRoom ' + creep.memory.targetRoom);
            roomName = creep.memory.targetRoom;
        }
        //console.log('CREEP.WORKERMANAGER.upgradecontroller');
        //console.log('CreepName ' + creep.name);
        //console.log('roomName ' + roomName);
        //console.log(Game.rooms[roomName]);
        
        var roomController = Game.rooms[roomName].controller;
        //console.log('WORKERMANAGER.upgradecontroller  ' +roomController.pos);
        var upgradeControllerResult = creep.upgradeController(roomController);
        if (upgradeControllerResult == OK)
        {
            creep.memory.action = 'upgradingController ' + roomController;
            return true;
        } else if (upgradeControllerResult == ERR_NOT_IN_RANGE) {
            creep.memory.action = 'moving to controller ' + roomController.pos +'';
            controller.move(creep,roomController);
            
        }        
    },
    scavengeResources: function(creep, room)
    {
        var tombStones = Game.rooms[room].find(FIND_TOMBSTONES);
        
    },
    mine: function(creep)
    {
        var roomName = creep.memory.roomName; // Room where creep spawned
        if (creep.memory.targetRoom) // Target room for creep
        {
            roomName = creep.memory.targetRoom;
        }
        
        var source;
        if (roomName != creep.pos.roomName) {
            var room = Game.rooms[roomName];
            var sources = room.find(FIND_MINERALS);
            source = sources[0];
        } else {
            source = creep.pos.findClosestByPath(FIND_MINERALS);
        }
        
        var harvestResult = creep.harvest(source);
        if (harvestResult == OK) {
            creep.memory.action = 'harvesting ' + source.pos;
        } else if (harvestResult == ERR_NOT_IN_RANGE) {
            creep.memory.action = 'moving to source ' + source.pos;
            controller.move(creep,source);
        }        
    },
    transferminerals: function(creep)
    {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE) && (_.sum(structure.store)) < structure.storeCapacity; }
        });
        if(target)
        {

            var transferResult = creep.transfer(target, RESOURCE_ENERGY);
            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.memory.action = 'transfering to structure [' + helper.whatstructureishere(target.pos) + ']';
                controller.move(creep, target);
                return true;
            }
            for(const resourceType in creep.carry) {
                creep.transfer(target, resourceType);
            }
        } 
    }
};
module.exports = workermanager;