/*
 * In this file you can specify all sort of initializers
 *  We provide an example of simple initializer that generates points withing a cube.
 */


function VoidInitializer ( opts ) {
    this._opts = opts;
    return this;
};

VoidInitializer.prototype.initialize = function ( particleAttributes, toSpawn ) {
    // toSpawn - array of indicies into arrays in particleAttributes
};
////////////////////////////////////////////////////////////////////////////////
// Basic Initializer
////////////////////////////////////////////////////////////////////////////////

function BallInitializer ( opts ) {
    this._opts = opts;
    return this;
};

BallInitializer.prototype.initializePositions = function ( positions, players, toSpawn) {
    var base = this._opts.sphere;
    var base_pos = new THREE.Vector3( base.x, base.y, base.z );

    // only spawn 2 balls by default, one for each player
    if (SystemSettings.mySystem.player1_numBalls < 1) {
        var idx = toSpawn[0];
        var platform = SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0];
        var platformPos = platform.mesh.position;
        var pos = new THREE.Vector3(platformPos.x, platformPos.y + 15, platformPos.z);
        setElement( idx, positions, pos );
        setElement( idx, players, platform.player);
        SystemSettings.mySystem.player1_numBalls++;
    }
    if (SystemSettings.mySystem.player2_numBalls < 1) {
        var idx = toSpawn[1];
        var platform = SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1];
        var platformPos = platform.mesh.position;
        var pos = new THREE.Vector3(platformPos.x, platformPos.y + 15, platformPos.z);
        setElement( idx, positions, pos );
        setElement( idx, players, platform.player);
        SystemSettings.mySystem.player2_numBalls++;
    }
    
    positions.needUpdate = true;
    players.needUpdate = true;
}

BallInitializer.prototype.initializeVelocities = function ( velocities, positions, players, toSpawn ) {
    var base_vel = this._opts.velocity;
    // initialize velocity if ball is in play
    for ( var i = 0 ; i < 2 ; ++i ) {
        var idx = toSpawn[i];
        var vel = new THREE.Vector3(0, 0, 0);
        var player = getElement(idx, players);
        if (player == 1 || player == 2) {
            setElement( idx, velocities, vel );
        }
    }
    velocities.needUpdate = true;
}

BallInitializer.prototype.initializeColors = function ( colors, players, toSpawn ) {
    var base_col = this._opts.color;
    // initialize color if ball is in play
    for ( var i = 0 ; i < 2 ; ++i ) {
        var idx = toSpawn[i];
        var player = getElement( idx, players );
        // color corresponds to each player
        if (player == 1) {
            var col = new THREE.Vector4 ( 0.7, 1.0, 0.7, 1.0 );
            setElement( idx, colors, col );
        }
        else if (player == 2) {
            var col = new THREE.Vector4 ( 1.0, 0.8, 1.0, 1.0 );
            setElement( idx, colors, col );
        }
    }
    colors.needUpdate = true;
}

BallInitializer.prototype.initializeSizes = function ( sizes, players, toSpawn ) {

    // initialize size if ball is in play
    for ( var i = 0 ; i < 2 ; ++i ) {
        var idx = toSpawn[i];
        var size = this._opts.size;
        var player = getElement(idx, players);
        if (player == 1 || player == 2) {
            setElement( idx, sizes, size );
        }
    }
    sizes.needUpdate = true;
}

BallInitializer.prototype.initializeLifetimes = function ( lifetimes, players, toSpawn ) {

    // initialize lifetime if ball is in play
    for ( var i = 0 ; i < 2 ; ++i ) {
        var idx = toSpawn[i];
        var lifetime = this._opts.lifetime;
        var player = getElement(idx, players);
        if (player == 1 || player == 2) {
            setElement( idx, lifetimes, lifetime );
        }
    }
    lifetimes.needUpdate = true;
}

// how to make this funciton nicer to work with. This one is kinda ok, as for initialization
// everything is independent
BallInitializer.prototype.initialize = function ( particleAttributes, toSpawn ) {

    // update required values
    this.initializePositions( particleAttributes.position, particleAttributes.player, toSpawn );

    this.initializeVelocities( particleAttributes.velocity, particleAttributes.position, particleAttributes.player, toSpawn );

    this.initializeColors( particleAttributes.color, particleAttributes.player, toSpawn );

    this.initializeLifetimes( particleAttributes.lifetime, particleAttributes.player, toSpawn );

    this.initializeSizes( particleAttributes.size, particleAttributes.player, toSpawn );
};