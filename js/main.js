
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
        var platform = SystemSettings.mySystem.updaterSettings.collidables.bouncePlatform;
        var pos = platform.mesh.position;
        var roomWidth = SystemSettings.mySystem.roomWidth;
        var moveFactor = 50;

        // Left arrow
        if (e.keyCode == 37) {
            console.log("left");
            var leftDist = platform.xMin + (roomWidth / 2);

            var tempMoveFactor = moveFactor;
            // stop at wall
            if (moveFactor > leftDist) {
                tempMoveFactor = leftDist;
            }
            platform.xMin -= tempMoveFactor;
            platform.xMax -= tempMoveFactor;
            pos.set(pos.x - tempMoveFactor, pos.y, pos.z);

            var particleAttributes = emitters[0]._particleAttributes;
            var positions = particleAttributes.position;
            var velocities = particleAttributes.velocity;
            for (var i = 0; i < positions.length; i++) {
                var v = getElement( i, velocities );
                if (v.length() < EPS) {
                    var ballPos = getElement( i, positions );
                    ballPos.x -= tempMoveFactor;
                    setElement(i, positions, ballPos)
                }
            }
        }

        // Right arrow
        if (e.keyCode == 39) {
            console.log("right");
            var rightDist = (roomWidth / 2) - platform.xMax;
            var tempMoveFactor = moveFactor;
            // stop at wall
            if (moveFactor > rightDist) {
                tempMoveFactor = rightDist;
            }
            platform.xMin += tempMoveFactor;
            platform.xMax += tempMoveFactor;
            pos.set(pos.x + tempMoveFactor, pos.y, pos.z);

            var particleAttributes = emitters[0]._particleAttributes;
            var positions = particleAttributes.position;
            var velocities = particleAttributes.velocity;
            for (var i = 0; i < positions.length; i++) {
                var v = getElement( i, velocities );
                if (v.length() < EPS) {
                    var ballPos = getElement( i, positions );
                    ballPos.x += tempMoveFactor;
                    setElement(i, positions, ballPos)
                }
            }
        }

        // Up arrow
        if (e.keyCode == 38) {
            console.log("up");
            platform.zMin -= moveFactor;
            platform.zMax -= moveFactor;
            pos.set(pos.x, pos.y, pos.z - moveFactor);

            var particleAttributes = emitters[0]._particleAttributes;
            var positions = particleAttributes.position;
            var velocities = particleAttributes.velocity;
            for (var i = 0; i < positions.length; i++) {
                var v = getElement( i, velocities );
                if (v.length() < EPS) {
                    var ballPos = getElement( i, positions );
                    ballPos.z -= moveFactor;
                    setElement(i, positions, ballPos)
                }
            }
        }

        // Down arrow
        if (e.keyCode == 40) {
            console.log("down");
            platform.zMin += moveFactor;
            platform.zMax += moveFactor;
            pos.set(pos.x, pos.y, pos.z + moveFactor);

            var particleAttributes = emitters[0]._particleAttributes;
            var positions = particleAttributes.position;
            var velocities = particleAttributes.velocity;
            for (var i = 0; i < positions.length; i++) {
                var v = getElement( i, velocities );
                if (v.length() < EPS) {
                    var ballPos = getElement( i, positions );
                    ballPos.x += moveFactor;
                    setElement(i, positions, ballPos)
                }
            }
        }

        // Space bar
        if (e.keyCode == 32) {
            console.log("space");
            var particleAttributes = emitters[0]._particleAttributes;
            var velocities = particleAttributes.velocity;

            var rand = (Math.random() - 0.5) * 250;
            var vel = new THREE.Vector3(rand, 500, 0);

            for (var i = 0; i < velocities.length; i++) {
                var v = getElement( i, velocities );
                console.log(v.length());
                if (v.length() < EPS) {
                    setElement( i, velocities, vel );
                }
            }

        }

    }, false);
};
