var helper = require('common.helper');
var roomController = require('room.controller');
var creepController = require('creep.controller');


var roomManager = {
    run: function(jsonRoomMap, jsonCreepLevelMap) {
    
        var defaultSpawn = jsonRoomMap.GAME_CONFIG.defaultSpawn;
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
                
                this.structureManager(room,controllerLevel,roomJson);
                this.controllerUpgradeManager(roomName, controllerLevel);

                var s = room.find(FIND_MY_SPAWNS);
                var spawnName = defaultSpawn;
                if (s.length > 0)
                {
                    spawnName = s[0].name;
                }




                for (var creepIndex in jsonCreepLevelMap.CREEP_MAP) {
                    var creepName = creepIndex;

                    var currentCreepCount = _.filter(Game.creeps,function (creep) {
                        return creep.memory.role == creepName && creep.memory.targetRoom != null && creep.memory.targetRoom == roomName;
                    });
                    var targetCreepCount = jsonCreepLevelMap.CREEP_MAP[creepIndex][controllerLevel];

                    this.log('roomManger.run ',roomName + ' ' + creepName + ' ' + currentCreepCount.length + '/' + targetCreepCount);

                    if(currentCreepCount.length < targetCreepCount) {
                        creepController.spawnWorker(spawnName,creepName,roomName);
                    }
                }

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
                    this.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x - counter;
                    newY = source.pos.y + counter;
                    // check
                    this.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x;
                    newY = source.pos.y + counter;
                    //check
                    this.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x + counter;
                    newY = source.pos.y + counter;
                    // check
                    this.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x + counter;
                    newY = source.pos.y;
                    // check
                    this.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x + counter;
                    newY = source.pos.y - counter;
                    // check
                    this.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x;
                    newY = source.pos.y - counter;
                    // check
                    this.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
                    newX = source.pos.x - counter;
                    newY = source.pos.y - counter;
                    // check
                    this.buildExtension(roomName, new RoomPosition(newX,newY,roomName));
                    
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
    structureManager: function(room,controllerLevel,roomJson)
    {
        this.log('reportStructures',room + ' ' + controllerLevel);
        
        var roomStructures = room.find(FIND_MY_STRUCTURES);

        for (var structure in CONTROLLER_STRUCTURES)
        {
            var structureCount = roomStructures.filter(s => s.structureType == structure).length;
            var buildCount = CONTROLLER_STRUCTURES[structure][controllerLevel] - structureCount;
            if (buildCount > 0)
            {   
                this.log('  ', ' I can build '+ buildCount +'new: ' + structure);
                for (var newStructure in roomJson.locations[structure])
                {
                    this.log('  ', ' Should I build: [' + newStructure + '] ' + roomJson.locations[structure][newStructure].build);

                    if (roomJson.locations[structure][newStructure].build)
                    {
                        var textPos = roomJson.locations[structure][newStructure].position.split(',');
                        var pos = new RoomPosition(textPos[0],textPos[1], room);
                        var whatsHere = helper.whatstructureishere(pos);
                        
                        this.log('  builder ' + whatsHere);

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