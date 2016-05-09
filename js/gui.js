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

Gui.closeAlert = function () {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "1";
    var overlayDiv = document.getElementById('overlay_div');
    overlayDiv.style.display = 'none';
};

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

// non-implemented alert functionality
Gui.alertGameOver = function( msg ) {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "0.3";
    var overlayDiv = document.getElementById('overlay_div');
    overlayDiv.innerHTML = '<p>'+ msg + '</p><button id="ok" onclick="Gui.closeAlert()">Play Again</button>';
    overlayDiv.style.display = 'inline';
};

Gui.closeAlert = function () {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "1";
    var overlayDiv = document.getElementById('overlay_div');
    overlayDiv.style.display = 'none';

    // Reset powerups
    SystemSettings.mySystem.player1_cur2xPointsLifetime = 0;
    SystemSettings.mySystem.player2_curWideLifetime = 0;

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
    // var start_poses = SystemSettings.mySystem.platformsStartPos;
    // for (var i = 0; i < platforms.length; i++) {
    //     var platform = platforms[i];
    //     var start_pos = start_poses[i];
    //     var platformWidth = platform.xMax - platform.xMin;
    //     var platformHeight = platform.yMax - platform.yMin;
    //     var platformDepth = platform.zMax - platform.zMin;
    //     platform.xMin = start_pos.x - platformWidth / 2;
    //     platform.xMax = start_pos.x + platformWidth / 2;
    //     platform.yMin = start_pos.y - platformHeight / 2;
    //     platform.yMax = start_pos.y + platformHeight / 2;
    //     platform.zMin = start_pos.z - platformDepth / 2;
    //     platform.zMax = start_pos.z + platformDepth / 2;
    //     platform.mesh.position.set(start_pos.x, start_pos.y, start_pos.z);
    // }

    var start_poses = SystemSettings.mySystem.platformsStartPos;
    // player 1 platform
    var start_pos = start_poses[0];
    var factor = SystemSettings.mySystem.widePlatformFactor;
    var platformWidth = SystemSettings.mySystem.platformWidth;
    var geo = SystemSettings.mySystem.player1_platform.geo;
    var dims = new THREE.Vector3(geo.parameters.width, geo.parameters.height, geo.parameters.depth);
    var mesh = SystemSettings.mySystem.player1_platform.mesh;
    var position = mesh.position.clone();
    var material = SystemSettings.mySystem.player1_platform.material;

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
    var material = SystemSettings.mySystem.player2_platform.material;

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


    // Move all particles to initial position
    var positions = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < positions.length ; ++i ) {
        var pos = getElement( i, positions );
        var player = getElement( i, players );

        var platformPos = platforms[0].mesh.position;
        if (player != platforms[0].player) {
            platformPos = platforms[1].mesh.position;
        }

        var pos = new THREE.Vector3(platformPos.x, platformPos.y + 15, pos.z);
        var vel = new THREE.Vector3(0, 0, 0);

        setElement( i, positions, pos );
        setElement( i, velocities, vel );
    }

    // Reset the boxes with powerups
    var boxes = SystemSettings.mySystem.updaterSettings.collidables.bounceBoxes;
    var powerups = SystemSettings.mySystem.materialPowerups;
    var numPowerups = SystemSettings.mySystem.numPowerups;

    for (var i = 0; i < boxes.length; i++) {
        var bound = boxes[i].box;
        // kill all boxes
        if (bound.alive) {
            Scene.removeObject(bound.mesh);
        }
        var material = powerups[0][bound.player - 1];
        // select powerup
        var powerup = Math.round(Math.random() * numPowerups);
        if (powerup > 0 && material_powerups[powerup]) {
            material = material_powerups[powerup];
        }
        // create new boxes
        bound.alive = true;
        var box_geo   = new THREE.BoxGeometry(bound.xMax - bound.xMin, bound.yMax - bound.yMin, bound.zMax - bound.zMin);
        var box       = new THREE.Mesh( box_geo, material );
        box.position.set( (bound.xMin + bound.xMax) / 2, (bound.yMin + bound.yMax) / 2, (bound.zMin + bound.zMax) / 2 );
        Scene.addObject( box );
        bound.mesh = box;
        bound.powerup = powerup;

    }

    // Restart game timer and enable game
    SystemSettings.mySystem.currLifetime = SystemSettings.mySystem.gameLifetime;
    SystemSettings.mySystem.isPlayGame = true;
};
