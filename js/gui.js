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

    // Move platforms to initial position
    var platforms = SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms;
    var start_poses = SystemSettings.mySystem.platformsStartPos;
    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];
        var start_pos = start_poses[i];
        var platformWidth = platform.xMax - platform.xMin;
        var platformHeight = platform.yMax - platform.yMin;
        var platformDepth = platform.zMax - platform.zMin;
        platform.xMin = start_pos.x - platformWidth / 2;
        platform.xMax = start_pos.x + platformWidth / 2;
        platform.yMin = start_pos.y - platformHeight / 2;
        platform.yMax = start_pos.y + platformHeight / 2;
        platform.zMin = start_pos.z - platformDepth / 2;
        platform.zMax = start_pos.z + platformDepth / 2;
        platform.mesh.position.set(start_pos.x, start_pos.y, start_pos.z);
    }

    // Move all particles to initial position
    var positions = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < positions.length ; ++i ) {
        var pos = getElement( i, positions );
        var player = getElement( i, players );

        var platformPos = platforms[0].mesh.position;
        if (player != platform.player) {
            platformPos = platforms[1].mesh.position;
        }

        var pos = new THREE.Vector3(platformPos.x, platformPos.y + 15, pos.z);
        var vel = new THREE.Vector3(0, 0, 0);

        setElement( i, positions, pos );
        setElement( i, velocities, vel );
    }

    // Reset the boxes
    var boxes = SystemSettings.mySystem.updaterSettings.collidables.bounceBoxes;
    for (var i = 0; i < boxes.length; i++) {
        if (!boxes[i].box.alive) {
            boxes[i].box.alive = true;
            Scene.addObject(boxes[i].box.mesh);
        }
    }

    // Restart game timer and enable game
    SystemSettings.mySystem.currLifetime = SystemSettings.mySystem.gameLifetime;
    SystemSettings.mySystem.isPlayGame = true;
};
