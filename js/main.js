
var Main = Main || { };


// called when the gui params change and we need to update mesh
Main.particleSystemChangeCallback = function ( InputSettings ) {

    // Get rid of an old system
    ParticleEngine.stop();
    for ( var i = 0 ; i < ParticleEngine._emitters.length ; ++i ) {
        Scene.removeObject( ParticleEngine.getDrawableParticles( i ) );
    }
    ParticleEngine.removeEmitters();
    ParticleEngine.removeAnimations();

    // Get rid of old models
    Scene.removeObjects();

    // If we specified animated model, then let's load it first
    if ( InputSettings.animatedModelName ) {
        var loader = new THREE.JSONLoader( true );
        loader.load( InputSettings.animatedModelName, InputSettings.animationLoadFunction );
    }

    // Create new system
    var initializer = new InputSettings.initializerFunction ( InputSettings.initializerSettings );

    var updater     = new InputSettings.updaterFunction ( InputSettings.updaterSettings );

    var emitter     = new Emitter( {
        maxParticles:  InputSettings.maxParticles,   // how many particles can be generated by this emitter?
        particlesFreq: InputSettings.particlesFreq,  // how many particle per second will we emit?
        initialize:    initializer,                  // initializer object
        update:        updater,                      // updater object
        material:      InputSettings.particleMaterial,
        cloth:         InputSettings.cloth,
        width:         InputSettings.width,
        height:        InputSettings.height,
    } );

    // If we are not dealing with cloth, lets sort particles
    if ( !InputSettings.cloth ) {
        emitter.enableSorting( Gui.values.sorting );
    }

    ParticleEngine.addEmitter ( emitter );

    // Add new particle system
    ParticleEngine.start();

    // Add the particle system
    for ( var i = 0 ; i < ParticleEngine._emitters.length ; ++i ) {
        Scene.addObject( ParticleEngine.getDrawableParticles( i ) );
    }

    // Create the scene
    InputSettings.createScene();
};

// when HTML is finished loading, do this
window.onload = function() {

    // Setup renderer, scene and gui
    Gui.init( Main.controlsChangeCallback,
              Main.displayChangeCallback );

    Scene.create();

    // Add particle system
    Main.particleSystemChangeCallback( SystemSettings.mySystem );

    Renderer.create( Scene, document.getElementById("canvas") );

    Renderer.update();

    var emitters = ParticleEngine.getEmitters();
    for ( var i = 0 ; i < emitters.length ; i++ ) {
        emitters[i]._material.uniforms.texture.value = new THREE.ImageUtils.loadTexture( 'images/base.png' );
        emitters[i]._material.needsUpdate  = true;
        // console.log(emitters[i].getDrawableParticles());
    }

    var EPS = 0.5;

    window.addEventListener("keydown", function(e) {

        if (e.keyCode == 38 || e.keyCode == 40) { 
            e.preventDefault();
        }

        if (!SystemSettings.mySystem.isPlayGame) {
            return;
        }

        var platforms = SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms;
        var platform = platforms[0];
        var platform_2 = platforms[1];
        var pos = platform.mesh.position;
        var pos_2 = platform_2.mesh.position;
        var boxes = SystemSettings.mySystem.updaterSettings.collidables.bounceBoxes;
        var roomWidth = SystemSettings.mySystem.roomWidth;
        var moveFactor = 50;

        // 'A' key
        if (e.keyCode == 65) {
            console.log("A");
            e.preventDefault();
            var leftDist = platform.xMin + (roomWidth / 2);
            var tempMoveFactor = moveFactor;
            // stop at wall
            if (moveFactor > leftDist) {
                tempMoveFactor = leftDist;
            }
            // or stop at other platform
            var leftPlatformDist = platform.xMin - platform_2.xMax;
            if (pos.z == pos_2.z && leftPlatformDist >= 0 && tempMoveFactor > leftPlatformDist) {
                tempMoveFactor = leftPlatformDist;
            }
            // move platform
            platform.xMin -= tempMoveFactor;
            platform.xMax -= tempMoveFactor;
            pos.set(pos.x - tempMoveFactor, pos.y, pos.z);

            // move particle with platform if need to launch
            var particleAttributes = emitters[0]._particleAttributes;
            var positions = particleAttributes.position;
            var velocities = particleAttributes.velocity;
            var players = particleAttributes.player;
            for (var i = 0; i < positions.length; i++) {
                var player = getElement( i , players );
                if (player != platform.player) {
                    continue;
                }
                var v = getElement( i, velocities );
                if (v.length() < EPS) {
                    var ballPos = getElement( i, positions );
                    ballPos.x -= tempMoveFactor;
                    setElement(i, positions, ballPos)
                }
            }
        }

        // 'D' key
        if (e.keyCode == 68) {
            console.log("D");
            e.preventDefault();
            var rightDist = (roomWidth / 2) - platform.xMax;
            var tempMoveFactor = moveFactor;
            // stop at wall
            if (moveFactor > rightDist) {
                tempMoveFactor = rightDist;
            }
            // or stop at other platform
            var rightPlatformDist = platform_2.xMin - platform.xMax;
            if (pos.z == pos_2.z && rightPlatformDist >= 0 && tempMoveFactor > rightPlatformDist) {
                tempMoveFactor = rightPlatformDist;
            }
            // move platform
            platform.xMin += tempMoveFactor;
            platform.xMax += tempMoveFactor;
            pos.set(pos.x + tempMoveFactor, pos.y, pos.z);

            // move particle with platform if need to launch
            var particleAttributes = emitters[0]._particleAttributes;
            var positions = particleAttributes.position;
            var velocities = particleAttributes.velocity;
            var players = particleAttributes.player;
            for (var i = 0; i < positions.length; i++) {
                var player = getElement( i , players );
                if (player != platform.player) {
                    continue;
                }
                var v = getElement( i, velocities );
                if (v.length() < EPS) {
                    var ballPos = getElement( i, positions );
                    ballPos.x += tempMoveFactor;
                    setElement(i, positions, ballPos)
                }
            }
        }

        // 'W' key
        if (e.keyCode == 87) {
            console.log("W");
            e.preventDefault();
            var box = boxes[boxes.length - 1].box;

            // only move across plane if don't collide with other platform
            if (platform.xMin > platform_2.xMax || platform.xMax < platform_2.xMin) {
                platform.zMin -= moveFactor / 2;
                platform.zMax -= moveFactor / 2;
                pos.set(pos.x, pos.y, (box.zMin + box.zMax) / 2);
            }
        }

        // 'S' key
        if (e.keyCode == 83) {
            console.log("S");
            e.preventDefault();
            var box = boxes[0].box;

            // only move across plane if don't collide with other platform
            if (platform.xMin > platform_2.xMax || platform.xMax < platform_2.xMin) {
                platform.zMin += moveFactor / 2;
                platform.zMax += moveFactor / 2;
                pos.set(pos.x, pos.y, (box.zMin + box.zMax) / 2);
            }
        }

        // Tab key
        if (e.keyCode == 9) {
            console.log("tab");
            e.preventDefault();
            var particleAttributes = emitters[0]._particleAttributes;
            var velocities = particleAttributes.velocity;

            var rand = (Math.random() - 0.5) * 250;
            var vel = new THREE.Vector3(rand, 500, 0);

            // launch respective particle
            var players = particleAttributes.player;
            for (var i = 0; i < velocities.length; i++) {
                var player = getElement( i , players );
                if (player != platform.player) {
                    continue;
                }
                var v = getElement( i, velocities );
                if (v.length() < EPS) {
                    setElement( i, velocities, vel );
                }
            }
        }

        // Left arrow
        if (e.keyCode == 37) {
            console.log("left");
            e.preventDefault();
            var leftDist = (roomWidth / 2) - platform_2.xMax;
            var tempMoveFactor = moveFactor;
            // stop at wall
            if (moveFactor > leftDist) {
                tempMoveFactor = leftDist;
            }
            // or stop at other platform
            var leftPlatformDist = platform.xMin - platform_2.xMax;
            if (pos.z == pos_2.z && leftPlatformDist >= 0 && tempMoveFactor > leftPlatformDist) {
                tempMoveFactor = leftPlatformDist;
            }
            // move platform
            platform_2.xMin += tempMoveFactor;
            platform_2.xMax += tempMoveFactor;
            pos_2.set(pos_2.x + tempMoveFactor, pos_2.y, pos_2.z);

            // move particle with platform if need to launch
            var particleAttributes = emitters[0]._particleAttributes;
            var positions = particleAttributes.position;
            var velocities = particleAttributes.velocity;
            var players = particleAttributes.player;
            for (var i = 0; i < positions.length; i++) {
                var player = getElement( i , players );
                if (player != platform_2.player) {
                    continue;
                }
                var v = getElement( i, velocities );
                if (v.length() < EPS) {
                    var ballPos = getElement( i, positions );
                    ballPos.x += tempMoveFactor;
                    setElement(i, positions, ballPos)
                }
            }
        }

        // Right arrow
        if (e.keyCode == 39) {
            console.log("right");
            e.preventDefault();
            var rightDist = platform_2.xMin + (roomWidth / 2);
            var tempMoveFactor = moveFactor;
            // stop at wall
            if (moveFactor > rightDist) {
                tempMoveFactor = rightDist;
            }
            // or stop at other platform
            var rightPlatformDist = platform_2.xMin - platform.xMax;
            if (pos.z == pos_2.z && rightPlatformDist >= 0 && tempMoveFactor > rightPlatformDist) {
                tempMoveFactor = rightPlatformDist;
            }
            // move platform
            platform_2.xMin -= tempMoveFactor;
            platform_2.xMax -= tempMoveFactor;
            pos_2.set(pos_2.x - tempMoveFactor, pos_2.y, pos_2.z);

            // move particle with platform if need to launch
            var particleAttributes = emitters[0]._particleAttributes;
            var positions = particleAttributes.position;
            var velocities = particleAttributes.velocity;
            var players = particleAttributes.player;
            for (var i = 0; i < positions.length; i++) {
                var player = getElement( i , players );
                if (player != platform_2.player) {
                    continue;
                }                var v = getElement( i, velocities );
                if (v.length() < EPS) {
                    var ballPos = getElement( i, positions );
                    ballPos.x -= tempMoveFactor;
                    setElement(i, positions, ballPos)
                }
            }
        }

        // Up arrow
        if (e.keyCode == 38) {
            console.log("up");
            e.preventDefault();
            var box = boxes[0].box;

            // only move across plane if don't collide with other platform
            if (platform_2.xMin > platform.xMax || platform_2.xMax < platform.xMin) {
                platform_2.zMin += moveFactor / 2;
                platform_2.zMax += moveFactor / 2;
                pos_2.set(pos_2.x, pos_2.y, (box.zMin + box.zMax) / 2);
            }
        }

        // Down arrow
        if (e.keyCode == 40) {
            console.log("down");
            e.preventDefault();
            var box = boxes[boxes.length - 1].box;

            // only move across plane if don't collide with other platform
            if (platform_2.xMin > platform.xMax || platform_2.xMax < platform.xMin) {
                platform_2.zMin -= moveFactor / 2;
                platform_2.zMax -= moveFactor / 2;
                pos_2.set(pos_2.x, pos_2.y, (box.zMin + box.zMax) / 2);
            }
        }

        // Shift key
        if (e.keyCode == 16) {
            console.log("shift");
            e.preventDefault();
            var particleAttributes = emitters[0]._particleAttributes;
            var velocities = particleAttributes.velocity;

            var rand = (Math.random() - 0.5) * 250;
            var vel = new THREE.Vector3(rand, 500, 0);

            // launch respective particle
            var players = particleAttributes.player;
            for (var i = 0; i < velocities.length; i++) {
                var player = getElement( i , players );
                if (player != platform_2.player) {
                    continue;
                }
                var v = getElement( i, velocities );
                if (v.length() < EPS) {
                    setElement( i, velocities, vel );
                }
            }
        }

    }, false);
};
