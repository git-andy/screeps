var creepController = require('creep.controller');
var roomController = require('room.controller');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleAttacker = require('role.attacker');
var roleMiner = require('role.miner');
var roleExplorer = require('role.explorer');
var logger = require('common.logging');
var helper = require('common.helper');

var roomConfig = require('config.room');
var creepConfig = require('config.creeps');

var jsonRoomManager = require('room.manager');


var logRoomStatus = false;
var logConstructionSites = false;
var logStructureStatus = false;
var logCreepStatus = false;

var rooms = ['E7N42','E6N42'];

module.exports.loop = function () {
    if (logRoomStatus || logConstructionSites || logStructureStatus || logCreepStatus) { console.log(''); }
    if (logRoomStatus) { logger.logroomstatus(); }
    if (logConstructionSites) { logger.logconstructionsites('homeRoom'); }
    if (logStructureStatus) { logger.logstructures(); }
    
    //logger.logcreepdata(Game.creeps['upgrader_10702349']);
    //logger.logcreepdata(Game.creeps['explorer_10675996']);
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            //console.log('CREEP: deleteing creep memory ' + Memory.creeps[i].name);
            delete Memory.creeps[i];
        }
    }
    
    //console.log(Game.cpu.bucket + ' '  + Game.cpu.tickLimit+ ' '  + Game.cpu.limit);

    jsonRoomManager.run(roomConfig,creepConfig);
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'explorer') {
            roleExplorer.run(creep);
        }
        if (logCreepStatus) {logger.logcreepdata(creep);}
    }
}