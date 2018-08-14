var helper = require('common.helper');
var logger = require('common.logging');
var roomController = require('room.controller');
var creepController = require('creep.controller');
var roomDefender = require('room.defender');

var roomManager = {
    run: function(jsonRoomMap, jsonCreepLevelMap) {
    
        for (var roomIndex in jsonRoomMap.ROOM_MAP) {
            var roomJson = jsonRoomMap.ROOM_MAP[roomIndex];
            var roomName = roomJson.name;
            var room = Game.rooms[roomName];

            if (!room)
            {
                // this is a new room. Spawn a creep and send them there.
                var controllerPos = roomJson.locations.controller;
                creepController.spawnExplorer('Spawn2',roomName,controllerPos);
                
            } else {
                var controllerLevel = room.controller.level;
                
                this.reportStructures(room,controllerLevel);
                this.controllerUpgradeManager(roomName, controllerLevel);
                


                var s = room.find(FIND_MY_SPAWNS);
                var spawnName;
                if (s.length == 0)
                {
                    spawnName = "Spawn2";
                } else {
                    spawnName = s[0].name;
                }




                for (var creepIndex in jsonCreepLevelMap.CREEP_MAP) {
                    var creepName = jsonCreepLevelMap.CREEP_MAP[creepIndex];

                    var currentCreepCount = _.filter(Game.creeps,function (creep) {
                        return creep.memory.role == creepName && creep.memory.targetRoom != null && creep.memory.targetRoom == roomName;
                    });
                    var targetCreepCount = jsonCreepLevelMap.CREEP_MAP[creepIndex][controllerLevel];

                    console.log(roomName + ' ' + creepName + ' ' + currentCreepCount.length + '/' + targetCreepCount);

                    if(currentCreepCount.length < targetCreepCount) {
                        creepController.spawnWorker(spawnName,creepName,roomName);
                    }
                }

                /*
                var upgraders = _.filter(Game.creeps,function (creep) {
                    return creep.memory.role == 'upgrader' && creep.memory.targetRoom != null && creep.memory.targetRoom == roomName;
                });
                var builders = _.filter(Game.creeps,function (creep) {
                    return creep.memory.role == 'builder' && creep.memory.targetRoom != null && creep.memory.targetRoom == roomName;
                });
                var harvesters = _.filter(Game.creeps,function (creep) {
                    return creep.memory.role == 'harvester' && creep.memory.targetRoom != null && creep.memory.targetRoom == roomName;
                });
                var miners = _.filter(Game.creeps,function (creep) {
                    return creep.memory.role == 'miner' && creep.memory.targetRoom != null && creep.memory.targetRoom == roomName;
                });
                var repairers = _.filter(Game.creeps,function (creep) {
                    return creep.memory.role == 'repairer' && creep.memory.targetRoom != null && creep.memory.targetRoom == roomName;
                });
                var attackers = _.filter(Game.creeps,function (creep) {
                    return creep.memory.role == 'attacker' && creep.memory.targetRoom != null && creep.memory.targetRoom == roomName;
                });
                */

                /*
                var s = room.find(FIND_MY_SPAWNS);
                var spawnName;
                if (s.length == 0)
                {
                    spawnName = "Spawn2";
                } else {
                    spawnName = s[0].name;
                }
                var targetHarvesters = jsonCreepLevelMap.CREEP_MAP["harvester"][controllerLevel];
                var targetBuilders = jsonCreepLevelMap.CREEP_MAP["builder"][controllerLevel];
                var targetUpgraders = jsonCreepLevelMap.CREEP_MAP["upgrader"][controllerLevel];
                var targetMiners = jsonCreepLevelMap.CREEP_MAP["miner"][controllerLevel];
                var targetRepairers = jsonCreepLevelMap.CREEP_MAP["repairer"][controllerLevel];
                var targetAttackers = jsonCreepLevelMap.CREEP_MAP["attacker"][controllerLevel];                
                */
                /*
                console.log(roomName + ' upgraders  ' + upgraders.length + '/' + targetUpgraders);
                console.log(roomName + ' builders   ' + builders.length + '/' + targetBuilders);
                console.log(roomName + ' harvesters ' + harvesters.length + '/' + targetHarvesters);
                console.log(roomName + ' miners     ' + miners.length + '/' + targetMiners);
                console.log(roomName + ' repairers  ' + repairers.length + '/' + targetRepairers);
                */
                //console.log(roomName + ' attackers  ' + attackers.length + '/' + targetAttackers);

                /*

                if(harvesters.length < targetHarvesters) {
                    creepController.spawnWorker(spawnName,'harvester',roomName);
                }
                
                if (harvesters.length == targetHarvesters && builders.length == targetBuilders && upgraders.length < targetUpgraders) {
                    creepController.spawnWorker(spawnName,'upgrader',roomName);
                }
                
                if (harvesters.length == targetHarvesters && builders.length < targetBuilders) {
                    creepController.spawnWorker(spawnName,'builder',roomName);
                }
                
                if (harvesters.length == targetHarvesters && miners.length < targetMiners) {
                    creepController.spawnWorker(spawnName,'miner',roomName);
                }
                
                if (harvesters.length == targetHarvesters && builders.length == targetBuilders && upgraders.length == targetUpgraders && repairers.length < targetRepairers) {
                    creepController.spawnWorker(spawnName,'repairer',roomName);
                }
                */
                // if there are any CPUs left
                roomController.buildRoads(room);
                
            }
        }
    },
    controllerUpgradeManager: function(roomName, controllerLevel)
    {
        var allowedExtensions = CONTROLLER_STRUCTURES['extension'][controllerLevel];
        var currentExtensions = Game.rooms[roomName].find(FIND_STRUCTURES, { filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}}).length;
        var buildingExtensions = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}}).length;

        for (i = currentExtensions+buildingExtensions+1; i <= allowedExtensions; i++) { 
            Game.rooms[roomName].find(FIND_SOURCES).forEach(function(source){
                //Find free square somewhere nearby....
            
                for(counter = 2;counter<=10;counter++)
                {
                    var newX;
                    var newY;
                    
                    newX = source.pos.x - counter;
                    newY = source.pos.y;
                    // check & build
                    helper.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x - counter;
                    newY = source.pos.y + counter;
                    // check
                    helper.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x;
                    newY = source.pos.y + counter;
                    //check
                    helper.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x + counter;
                    newY = source.pos.y + counter;
                    // check
                    helper.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x + counter;
                    newY = source.pos.y;
                    // check
                    helper.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x + counter;
                    newY = source.pos.y - counter;
                    // check
                    helper.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x;
                    newY = source.pos.y - counter;
                    // check
                    helper.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x - counter;
                    newY = source.pos.y - counter;
                    // check
                    helper.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                }
                return;
            });
        }
    },
    buildExtension: function(roomName, position)
    {
        if (position.x > 0 && position.y > 0 && position.x < 50 && position.y < 50) {
            var whatsHere = helper.whatstructureishere(position);
            //console.log('Checking for extension ' + position + ' ' + whatsHere +' '+(!(whatsHere)));
            if (!(whatsHere))
            {
              var createResult = Game.rooms[roomName].createConstructionSite(position,STRUCTURE_EXTENSION);
              console.log('Create Extension Result -> ' + this.createResultToText(createResult));
            }
        }
    },
    reportStructures: function(room,controllerLevel)
    {
        this.log('reportStructures',room + ' ' + controllerLevel);
        
        var roomStructures = room.find(FIND_MY_STRUCTURES);

        for (var structure in CONTROLLER_STRUCTURES)
        {
            var structureCount = roomStructures.filter(s => s.structureType == structure).length;
            if (CONTROLLER_STRUCTURES[structure][controllerLevel] > structureCount)
            {
                this.log('  ', 'can build new ' + structure);
            }
            //this.log(' ', structure + ' ' + CONTROLLER_STRUCTURES[structure][controllerLevel] + '/' + structureCount);
        }
    },
    log: function(functionName, message)
    {
        console.log('roomManger.'+functionName+': ' + message);
    }
};

module.exports = roomManager;