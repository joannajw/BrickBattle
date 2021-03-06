"use strict";

var Gui = Gui || {};

// list of presets available in the GUI
Gui.sceneList = [];

Gui.windowSizes = [ "full","400x400","600x400","600x600","800x600","800x800" ];

Gui.blendTypes = [ "Normal", "Additive" ];

Gui.particleSystems = [ "basic", "fountainBounce", "fountainSink", "attractor", "animated", "cloth", "mySystem" ];

Gui.textures = [ "blank", "base", "fire", "smoke", "spark", "sphere", "smoke" ];


// due to a bug in dat GUI we need to initialize floats to non-interger values (like 0.5)
// (the variable Gui.defaults below then carries their default values, which we set later)
Gui.values = {
    windowSize:  Gui.windowSizes[0],
    reset:       function () {},
    stopTime:    function () {},
    guiToBatch : function() {},
    blendTypes:  Gui.blendTypes[0],
    textures:    Gui.textures[0],
    systems:     Gui.particleSystems[0],
    depthTest:   true,
    transparent: true,
    sorting:     true,
};

// defaults only hold actual mesh modifiers, no display
Gui.defaults = { };

Gui.alertOnce = function( msg ) {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "0.3";
    var overlayDiv = document.getElementById('overlay_div');
    overlayDiv.innerHTML = '<p>'+msg + '</p><button id="ok" onclick="Gui.closeAlert()">ok</button>';
    overlayDiv.style.display = 'inline';
};

// Gui.closeAlert = function () {
//     var mainDiv = document.getElementById('main_div');
//     mainDiv.style.opacity = "1";
//     var overlayDiv = document.getElementById('overlay_div');
//     overlayDiv.style.display = 'none';
// };

Gui.toCommandString = function () {
    var url = '';
    for ( var prop in Gui.defaults ) {
        if( Gui.values[prop] !== undefined && Gui.values[prop] !== Gui.defaults[prop]) {
            url += "&";
            var val = Gui.values[prop];

            if( !isNaN(parseFloat(val)) && val.toString().indexOf('.')>=0 ) {
                val = val.toFixed(2);
             }
            url += prop + "=" + val;
        }
    }
    return url;
}

Gui.init = function ( meshChangeCallback, controlsChangeCallback, displayChangeCallback ) {

    // // create top level controls
    // var gui     = new dat.GUI( { width: 300 } );
    // var size    = gui.add( Gui.values, 'windowSize', Gui.windowSizes ).name("Window Size");
    // var gToB    = gui.add( Gui.values, 'guiToBatch' );

    // // gui controls are added to this object below
    // var gc = {};
    // gc.stopTime  = gui.add( Gui.values, 'stopTime' ).name( "Pause" );
    // gc.reset     = gui.add( Gui.values, 'reset' ).name("Reset");
    // gc.systems   = gui.add( Gui.values, 'systems', Gui.particleSystems ).name("ParticleSystems");

    // var disp = gui.addFolder( "DISPLAY OPTIONS");
    // gc.blends    = disp.add( Gui.values, 'blendTypes', Gui.blendTypes ).name("Blending Types");
    // gc.textures  = disp.add( Gui.values, 'textures', Gui.textures ).name("Textures");
    // gc.depthTest = disp.add( Gui.values, 'depthTest' ).name("Depth Test");
    // gc.transp    = disp.add( Gui.values, 'transparent' ).name("Transparent");
    // gc.sort      = disp.add( Gui.values, 'sorting' ).name("Sorting");

    // // REGISTER CALLBACKS FOR WHEN GUI CHANGES:
    // size.onChange( Renderer.onWindowResize );

    // gc.stopTime.onChange( ParticleEngine.pause );
    // gc.reset.onChange( ParticleEngine.restart );

    // gc.blends.onChange( function( value ) {
    //     var emitters = ParticleEngine.getEmitters();
    //     var blendType;
    //     if ( value == "Normal" ) {
    //         var blendType = THREE.NormalBlending;
    //     } else if ( value == "Additive" ) {
    //         var blendType = THREE.AdditiveBlending;
    //     } else {
    //         console.log( "Blend type unknown!" );
    //         return;
    //     }
    //     for ( var i = 0 ; i < emitters.length ; i++ ) {
    //         emitters[i]._material.blending = blendType ;
    //     }
    // } );

    // gc.textures.onChange( function( value ) {
    //     var emitters = ParticleEngine.getEmitters();
    //     for ( var i = 0 ; i < emitters.length ; i++ ) {
    //         emitters[i]._material.uniforms.texture.value = new THREE.ImageUtils.loadTexture( 'images/' + value + '.png' );
    //         emitters[i]._material.needsUpdate  = true;
    //     }
    // } );

    // gc.systems.onChange( function(value) {
    //     var settings = SystemSettings[value];
    //     Main.particleSystemChangeCallback ( settings );
    // } );

    // gc.depthTest.onChange( function( value ) {
    //     var emitters = ParticleEngine.getEmitters();
    //     for ( var i = 0 ; i < emitters.length ; i++ ) {
    //         emitters[i]._material.depthTest = value;
    //     }
    // });

    // gc.transp.onChange( function( value ) {
    //     var emitters = ParticleEngine.getEmitters();
    //     for ( var i = 0 ; i < emitters.length ; i++ ) {
    //         emitters[i]._material.transparent = value;
    //         emitters[i]._material.needsUpdate  = true ;
    //     }
    // });

    // gc.sort.onChange( function( value ) {
    //     var emitters = ParticleEngine.getEmitters();
    //     for ( var i = 0 ; i < emitters.length ; i++ ) {
    //         emitters[i]._sorting = value;
    //     }
    // });

    // gToB.onChange( function() {
    //     var url = 'batch.html?system=' + Gui.values.systems;
    //     url += '&texture='+Gui.values.textures;
    //     url += '&blending='+Gui.values.blendTypes;
    //     url += '&depthTest='+Gui.values.depthTest;
    //     url += '&transparent='+Gui.values.transparent;
    //     url += '&sorting='+Gui.values.sorting;
    //     url += '&size='+Gui.values.windowSize;
    //     window.open( url );
    // } );
};

Gui.alertGameOver = function( msg ) {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "0.3";
    var overlayDiv = document.getElementById('overlay_div');
    overlayDiv.innerHTML = '<p>'+ msg + '<br><button id="ok" onclick="Gui.closeAlert()">Play Again</button>';
    overlayDiv.style.display = 'inline';
};

Gui.closeAlert = function () {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "1";
    var overlayDiv = document.getElementById('overlay_div');
    overlayDiv.style.display = 'none';
    var instructionsDiv = document.getElementById('instructions_div');
    instructionsDiv.style.display = 'none';

    // Reset powerups
    SystemSettings.mySystem.player1_cur2xPointsLifetime = 0;
    SystemSettings.mySystem.player2_cur2xPointsLifetime = 0;
    SystemSettings.mySystem.player1_curWideLifetime = 0;
    SystemSettings.mySystem.player2_curWideLifetime = 0;
    SystemSettings.mySystem.player1_curFreezeLifetime = 0;
    SystemSettings.mySystem.player2_curFreezeLifetime = 0;

    // Reset player scores
    var emitters = ParticleEngine.getEmitters();
    var particleAttributes = emitters[0]._particleAttributes;
    var players = particleAttributes.player;

    for ( var i = 0 ; i < players.length ; ++i ) {
        var player = getElement( i, players );
        if (player == 1) {
            document.getElementById("score").innerHTML = 0;
        }
        else if (player == 2) {
            document.getElementById("score_2").innerHTML = 0;
        }
    }

    // Move platforms to initial position and reset sizes
    var platforms = SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms;
    var start_poses = SystemSettings.mySystem.platformsStartPos;
    // player 1 platform
    var start_pos = start_poses[0];
    var factor = SystemSettings.mySystem.widePlatformFactor;
    var platformWidth = SystemSettings.mySystem.platformWidth;
    var geo = SystemSettings.mySystem.player1_platform.geo;
    var dims = new THREE.Vector3(geo.parameters.width, geo.parameters.height, geo.parameters.depth);
    var mesh = SystemSettings.mySystem.player1_platform.mesh;
    var position = mesh.position.clone();
    var material = SystemSettings.mySystem.material_platformDefault1;

    Scene.removeObject(mesh);

    geo = new THREE.BoxGeometry(platformWidth, dims.y, dims.z);
    mesh = new THREE.Mesh( geo, material);
    mesh.position.set(start_pos.x, start_pos.y, start_pos.z);

    Scene.addObject(mesh);

    SystemSettings.mySystem.player1_platform = {
        geo: geo,
        mesh: mesh,
        material : material
    }
    SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].xMin = start_pos.x - platformWidth / 2,
    SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].xMax = start_pos.x + platformWidth / 2,
    SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].mesh = mesh;

    // player 2 platform
    start_pos = start_poses[1];
    var factor = SystemSettings.mySystem.widePlatformFactor;
    var platformWidth = SystemSettings.mySystem.platformWidth;
    var geo = SystemSettings.mySystem.player2_platform.geo;
    var dims = new THREE.Vector3(geo.parameters.width, geo.parameters.height, geo.parameters.depth);
    var mesh = SystemSettings.mySystem.player2_platform.mesh;
    var position = mesh.position.clone();
    var material = SystemSettings.mySystem.material_platformDefault2;

    Scene.removeObject(mesh);

    geo = new THREE.BoxGeometry(platformWidth, dims.y, dims.z);
    mesh = new THREE.Mesh( geo, material);
    mesh.position.set(start_pos.x, start_pos.y, start_pos.z);

    Scene.addObject(mesh);

    SystemSettings.mySystem.player2_platform = {
        geo: geo,
        mesh: mesh,
        material : material
    }
    SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].xMin = start_pos.x - platformWidth / 2,
    SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].xMax = start_pos.x + platformWidth / 2,
    SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].mesh = mesh;


    // Move all particles to initial position, delete extra ones
    var positions = particleAttributes.position;
    var velocities   = particleAttributes.velocity;
    var sizes = particleAttributes.size;

    for ( var i = 0 ; i < positions.length ; ++i ) {
        var pos = getElement( i, positions );
        var player = getElement( i, players );

        var platformPos = platforms[0].mesh.position;
        if (player != platforms[0].player) {
            platformPos = platforms[1].mesh.position;
        }

        var pos = new THREE.Vector3(platformPos.x, platformPos.y + 15, pos.z);
        var vel = new THREE.Vector3(0, 0, 0);

        // delete extra balls
        if (SystemSettings.mySystem.player1_numBalls > 1 && player == 1) {
            pos = new THREE.Vector3(0, 0, 0);
            setElement(i, sizes, 0);
            setElement(i, players, -1);
            SystemSettings.mySystem.player1_numBalls--;
        }
        else if (SystemSettings.mySystem.player2_numBalls > 1 && player == 2) {
            pos = new THREE.Vector3(0, 0, 0);
            setElement(i, sizes, 0);
            setElement(i, players, -1);
            SystemSettings.mySystem.player2_numBalls--;
        }

        setElement( i, positions, pos );
        setElement( i, velocities, vel );
    }

    // Reset the boxes with powerups
    var boxes = SystemSettings.mySystem.updaterSettings.collidables.bounceBoxes;
    var material_powerups = SystemSettings.mySystem.materialPowerups;
    var material_probs_total = SystemSettings.mySystem.material_probs_total;
    var material_probs = SystemSettings.mySystem.material_probs;

    /**
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     *
     * From http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    // determine number of each powerup
    var powerups = [];
    var count = 0;
    for (var j = 1; j < material_probs.length; j++) {
        var numPowerups = Math.round(material_probs[j] / material_probs_total * boxes.length / 2);
        for (var k = 0; k < numPowerups; k++) {
            powerups.push(j);
            count++;
        }
    }
    for (var j = count; j < boxes.length / 2; j++) {
        powerups.push(0);
    }
    // randomize powerups
    var shuffledPowerups = shuffleArray(powerups);
    shuffledPowerups = shuffledPowerups.concat(shuffleArray(powerups.slice()));

    for (var i = 0; i < boxes.length; i++) {
        var bound = boxes[i].box;
        // kill all boxes
        if (bound.alive) {
            Scene.removeObject(bound.mesh);
            Scene.removeObject(bound.backMesh);
        }
        var material = material_powerups[0][bound.player - 1];
        // select powerup
        var powerup = shuffledPowerups[i];
        if (powerup > 0) {
            material = material_powerups[powerup];
        }
        // create new boxes
        bound.alive = true;
        var box_geo   = new THREE.BoxGeometry(bound.xMax - bound.xMin, bound.yMax - bound.yMin, bound.zMax - bound.zMin);
        var box       = new THREE.Mesh( box_geo, material );
        box.position.set( (bound.xMin + bound.xMax) / 2, (bound.yMin + bound.yMax) / 2, (bound.zMin + bound.zMax) / 2 );
        Scene.addObject( box );
        bound.mesh = box;
        // make the back of bricks all the same color
        var back_brick_geo = new THREE.BoxGeometry(bound.xMax - bound.xMin, bound.yMax - bound.yMin, bound.zMax - bound.zMin);
        var back_brick = new THREE.Mesh(back_brick_geo, material_powerups[0][bound.player - 1]);
        var zPosition = bound.zMin - 0.1;
        if (bound.player == 2) {
            zPosition = bound.zMax + 0.1;
        }
        back_brick.position.set(box.position.x, box.position.y, zPosition);
        Scene.addObject(back_brick);
        bound.backMesh = back_brick;
        bound.powerup = powerup;

    }

    // Restart game timer and enable game
    SystemSettings.mySystem.currLifetime = SystemSettings.mySystem.gameLifetime;
    SystemSettings.mySystem.isPlayGame = true;
};

// Enter or space will also restart the game after game over
window.addEventListener("keydown", function(e) {
    if (!SystemSettings.mySystem.isPlayGame && (e.keyCode == 13 || e.keyCode == 32)) {
        e.preventDefault();
        Gui.closeAlert();
    }
}, false);
