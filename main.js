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
var roomConfig = require('config.room.json');

var jsonRoomManager = require('room.manager');


var logRoomStatus = false;
var logConstructionSites = false;
var logStructureStatus = false;
var logCreepStatus = false;

var creepLevelMap = JSON.parse('{"CREEP_MAP": {' +
    '"harvester":   {"0":1,"1":1,"2":1,"3":2,"4":2,"5":3,"6":2,"7":3,"8":3}'+
    ',"builder":     {"0":1,"1":1,"2":1,"3":2,"4":2,"5":3,"6":2,"7":3,"8":3}'+
    ',"upgrader":    {"0":1,"1":1,"2":1,"3":2,"4":2,"5":2,"6":2,"7":3,"8":3}'+
    ',"repairer":    {"0":0,"1":0,"2":1,"3":1,"4":2,"5":2,"6":2,"7":3,"8":3}'+
    ',"miner":       {"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":1,"7":2,"8":3}'+
    ',"attacker":    {"0":0,"1":0,"2":0,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1}'+
    //',"explorer":    {"0":0,"1":0,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1}'+
    '}}');

var rooms = ['E7N42','E6N42'];

var roomMap = JSON.parse('{"ROOM_MAP":[' +
    ' {"name":"E6N42","action":"inhabit","locations":{"controller":"5,30","storage":"30,20","spawns":[{"E6N42_SPAWN":"23,21"}],"sources":[{"source1":"30,19"}]}}'+
    ',{"name":"E7N42","action":"inhabit","locations":{"controller":"28,42","spawns":[{"Spawn2":"29,22"}],"sources":[{"source1":"45,38","source2":"23,4"}]}}' +
    ']}');

//roomMap = '{"ROOM_MAP": [{"name": "E6N42","action": "inhabit","locations": {"controller": "5,30","spawn": [{"build": true,"name":"E6N42_SPAWN_1","position": "23,21"},{"build": true,"name":"E6N42_SPAWN_2","position": "x,y"}],"link": [{"build": false,"position": "x,y"}],"road": [{"build": false,"position": "x,y"}],"constructedWall": [{"build": false,"position": "x,y"}],"rampart": [{"build": false,"position": "x,y"}],"storage": [{"build": false,"position": "x,y"}],"tower": [{"build": true,"position": "22,19"}],"observer": [{"build": false,"position": "x,y"}],"powerSpawn": [{"build": false,"position": "x,y"}],"extractor": [{"build": false,"position": "x,y"}],"terminal": [{"build": false,"position": "x,y"}],"lab": [{"build": false,"position": "x,y"}],"container": [{"build": false,"position": "x,y"}],"nuker": [{"build": false,"position": "x,y"}]},"resources": {"energy": [{"position": "30,19"}]}},{"name": "E7N42","action": "inhabit","locations": {"controller": "28,42","spawn": [{"build": true,"name":"Spawn2","position": "29,22","default":true},{"build": false,"name":"E7N42_SPAWN_2","position": "x,y"}],"link": [{"build": false,"position": "x,y"}],"road": [{"build": false,"position": "x,y"}],"constructedWall": [{"build": false,"position": "x,y"}],"rampart": [{"build": false,"position": "x,y"}],"storage": [{"build": false,"position": "x,y"}],"tower": [{"build": true,"position": "30,24"},{"build":true,"position": "14,6"}],"observer": [{"build": false,"position": "x,y"}],"powerSpawn": [{"build": false,"position": "x,y"}],"extractor": [{"build": true,"position": "43,18"}],"terminal": [{"build": false,"position": "x,y"}],"lab": [{"build": true,"position": "43,20"},{"build": true,"position": "44,21"},{"build": true,"position": "42,21"}],"container": [{"build": false,"position": "x,y"}],"nuker": [{"build": false,"position": "x,y"}]},"resources": {"energy": [{"position": "45,38"},{"position": "34,4"}]}}]}';

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
    
    //roomManager.run(rooms,creepLevelMap);
    jsonRoomManager.run(roomMap,creepLevelMap);
    
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