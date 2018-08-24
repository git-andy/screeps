var helper = require('common.helper');
var roomController = require('room.controller');
var creepController = require('creep.controller');


var roomManager = {
    run: function(jsonRoomMap, jsonCreepLevelMap) {
    
        var defaultSpawn = jsonRoomMap.GAME_CONFIG['defaultSpawn'];
        var defaultSpawn = 'Spawn2';

        for (var roomIndex in jsonRoomMap.ROOM_MAP) {
            var startCPU1= Game.cpu.getUsed();
            var roomJson = jsonRoomMap.ROOM_MAP[roomIndex];
            var roomName = roomJson.name;
            var room = Game.rooms[roomName];
            var spawnState = 'GOOD';

            if (!room)
            {
                // this is a new room. Spawn a creep and send them there.
                var controllerPos = roomJson.locations.controller;
                creepController.spawnExplorer(defaultSpawn,roomName,controllerPos);
                
            } else {
                var controllerLevel = room.controller.level;
                
                startCPU= Game.cpu.getUsed();
                this.structureManager(room,controllerLevel,roomJson);
                console.log('3.1.1: structureManager ' + roomName + ' ' + (Game.cpu.getUsed() - startCPU ));

                startCPU= Game.cpu.getUsed();
                this.controllerUpgradeManager(roomName, controllerLevel);
                console.log('3.1.1: controllerUpgradeManager ' + roomName + ' ' + (Game.cpu.getUsed() - startCPU ));


                if (spawnState == 'GOOD') {
                    var s = room.find(FIND_MY_SPAWNS);
                    var spawnName = defaultSpawn;
                    if (s.length > 0)
                    {
                        spawnName = s[0].name;
                    }
                    startCPU= Game.cpu.getUsed();
                    for (var creepIndex in jsonCreepLevelMap.CREEP_MAP) {
                        var creepName = creepIndex;

                        var currentCreepCount = _.filter(Game.creeps,function (creep) {
                            return creep.memory.role == creepName && creep.memory.targetRoom != null && creep.memory.targetRoom == roomName;
                        });
                        var targetCreepCount = jsonCreepLevelMap.CREEP_MAP[creepIndex][controllerLevel];

                        //this.log('roomManger.run ',roomName + ' ' + creepName + ' ' + currentCreepCount.length + '/' + targetCreepCount);

                        if(currentCreepCount.length < targetCreepCount) {
                            if (creepController.spawnWorker(spawnName,creepName,roomName) != OK) {
                                spawnState = 'WAITING';
                            }
                            break;
                        }
                    }
                    console.log('3.1.1: creepspawn counter manager ' + roomName + ' ' + (Game.cpu.getUsed() - startCPU ));

                }
                // if there are any CPUs left
                startCPU= Game.cpu.getUsed();
                'roomController.buildRoads(room);
                console.log('3.1.1: buildRoads' + roomName + ' ' + (Game.cpu.getUsed() - startCPU ));
            }
            console.log('3.1: ' + roomName + ' ' + (Game.cpu.getUsed() - startCPU1 ));
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
                    roomController.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x - counter;
                    newY = source.pos.y + counter;
                    // check
                    roomController.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x;
                    newY = source.pos.y + counter;
                    //check
                    roomController.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x + counter;
                    newY = source.pos.y + counter;
                    // check
                    roomController.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x + counter;
                    newY = source.pos.y;
                    // check
                    roomController.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x + counter;
                    newY = source.pos.y - counter;
                    // check
                    roomController.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x;
                    newY = source.pos.y - counter;
                    // check
                    roomController.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x - counter;
                    newY = source.pos.y - counter;
                    // check
                    roomController.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                }
                return;
            });
        }
    },
    structureManager: function(room,controllerLevel,roomJson)
    {
        //this.log('reportStructures',room + ' ' + controllerLevel);
        
        var roomStructures = room.find(FIND_MY_STRUCTURES);

        for (var structure in CONTROLLER_STRUCTURES)
        {
            var structureCount = roomStructures.filter(s => s.structureType == structure).length;
            var buildCount = CONTROLLER_STRUCTURES[structure][controllerLevel] - structureCount;
            if (buildCount > 0)
            {   
                for (var newStructure in roomJson.locations[structure])
                {
                    if (roomJson.locations[structure][newStructure].build)
                    {
                        var textPos = roomJson.locations[structure][newStructure].position.split(',');    
                        var pos = new RoomPosition(textPos[0],textPos[1], room.name);
                        var whatsHere = helper.whatstructureishere(pos);
                        
                        this.log('structureManager','  builder ' + whatsHere);
                        var createConstSiteResult = room.createConstructionSite(pos,structure);
                        this.log('structureManager','createSiteResult = ' + createConstSiteResult);

                    }
                }
            }
        }
    },
    log: function(functionName, message)
    {
        console.log('roomManger.'+functionName+': ' + message);
    }
};

module.exports = roomManager;