
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