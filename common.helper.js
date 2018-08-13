
var helper = {
    whatstructureishere : function(gameposition)
    {
        var result;
        gameposition.look().forEach(function(square) {
            if (square.type == 'structure') {
                result = square.structure.structureType;
            } else if (square.type == 'constructionSite') {
                result = square.constructionSite.structureType;
            }
        });
        
        return result;
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
    spawnResultToText: function(spawnResult)
    {
        switch (spawnResult) {
            case 0:
                return 'OK';
            case -1:
                return 'ERR_NOT_OWNER';
            case -3:
                return 'ERR_NAME_EXISTS';                
            case -4:
                return 'ERR_BUSY';
            case -6:
                return 'ERR_NOT_ENOUGH_ENERGY';
            case -10:
                return 'ERR_INVALID_ARGS';   
            case -14:
                return 'ERR_RCL_NOT_ENOUGH';  
            default:
                return 'Unknown';
        }
    },
    createResultToText: function(createResult)
    {
        switch (createResult) {
            case 0:
                return 'OK';
            case -7:
                return 'ERR_INVALID_TARGET';
            case -8:
                return 'ERR_FULL';                
            case -10:
                return 'ERR_INVALID_ARGS';
            case -14:
                return 'ERR_RCL_NOT_ENOUGH';
            default:
                return 'Unknown';
        }
    },
    moveResultToText: function(moveResult){
        switch (moveResult) {
            case 0:
                return 'OK';
            case -1:
                return 'ERR_NOT_OWNER';
            case -2:
                return 'ERR_NO_PATH';
            case -4:
                return 'ERR_BUSY';                
            case -7:
                return 'ERR_INVALID_TARGET';                
            case -11:
                return 'ERR_TIRED';
            case -12:
                return 'ERR_NO_BODYPART';
            default:
                return 'Unknown';
        }
    }
};

module.exports = helper;