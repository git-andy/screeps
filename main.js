var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleAttacker = require('role.attacker');
var roleMiner = require('role.miner');
var roleExplorer = require('role.explorer');
var logger = require('common.logging');
var roomDefender = require('room.defender');

var roomConfig = require('config.room');
var creepConfig = require('config.creeps');

var jsonRoomManager = require('room.manager');


var logRoomStatus = false;
var logConstructionSites = false;
var logStructureStatus = false;
var logCreepStatus = false;

module.exports.loop = function () {
    if (logRoomStatus || logConstructionSites || logStructureStatus || logCreepStatus) { console.log(''); }
    if (logRoomStatus) { logger.logroomstatus(); }
    if (logConstructionSites) { logger.logconstructionsites('homeRoom'); }
    if (logStructureStatus) { logger.logstructures(); }
    
    //logger.logcreepdata(Game.creeps['upgrader_10702349']);
    //logger.logcreepdata(Game.creeps['explorer_10675996']);
    
    var startCPU = Game.cpu.getUsed();
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            //console.log('CREEP: deleteing creep memory ' + Memory.creeps[i].name);
            delete Memory.creeps[i];
        }
    }
    console.log('1: ' + (Game.cpu.getUsed() - startCPU));

    startCPU = Game.cpu.getUsed();
    for(var name in Game.rooms) {
        roomDefender.defendRoom(name,2);
    }
    console.log('2: ' + (Game.cpu.getUsed() - startCPU ));

    startCPU = Game.cpu.getUsed();
    jsonRoomManager.run(roomConfig,creepConfig);
    console.log('3: ' + (Game.cpu.getUsed() - startCPU ));

    
    startCPU = Game.cpu.getUsed();
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            startCPU1 = Game.cpu.getUsed();
            roleHarvester.run(creep);
            console.log('4.1: harvester ' + (Game.cpu.getUsed() - startCPU1 ));
        }
        if(creep.memory.role == 'upgrader') {
            startCPU1 = Game.cpu.getUsed();
            roleUpgrader.run(creep);
            console.log('4.1: upgrader ' + (Game.cpu.getUsed() - startCPU1 ));
        }
        if(creep.memory.role == 'builder') {
            startCPU1 = Game.cpu.getUsed();
            roleBuilder.run(creep);
            console.log('4.1: builder ' + (Game.cpu.getUsed() - startCPU1 ));
        }
        if(creep.memory.role == 'repairer') {
            startCPU1 = Game.cpu.getUsed();
            roleRepairer.run(creep);
            console.log('4.1: repairer ' + (Game.cpu.getUsed() - startCPU1 ));
        }
        if(creep.memory.role == 'attacker') {
            startCPU1 = Game.cpu.getUsed();
            roleAttacker.run(creep);
            console.log('4.1: attacker ' + (Game.cpu.getUsed() - startCPU1 ));
        }
        if(creep.memory.role == 'miner') {
            startCPU1 = Game.cpu.getUsed();
            roleMiner.run(creep);
            console.log('4.1: miner ' + (Game.cpu.getUsed() - startCPU1 ));
        }
        if(creep.memory.role == 'explorer') {
            startCPU1 = Game.cpu.getUsed();
            roleExplorer.run(creep);
            console.log('4.1: explorer ' + (Game.cpu.getUsed() - startCPU1 ));
        }
        if (logCreepStatus) {logger.logcreepdata(creep);}
    }
    console.log('4: ' + (Game.cpu.getUsed() - startCPU ));
}