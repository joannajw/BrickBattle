var SystemSettings = SystemSettings || {};

SystemSettings.standardMaterial = new THREE.ShaderMaterial( {

    uniforms: {
        texture:  { type: 't',  value: new THREE.ImageUtils.loadTexture( 'images/blank.png' ) },
    },

    attributes: {
        velocity: { type: 'v3', value: new THREE.Vector3() },
        color:    { type: 'v4', value: new THREE.Vector3( 0.0, 0.0, 1.0, 1.0 ) },
        lifetime: { type: 'f', value: 1.0 },
        size:     { type: 'f', value: 1.0 },
    },

    vertexShader:   document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,

    blending:    Gui.values.blendTypes,
    transparent: Gui.values.transparent,
    depthTest:   Gui.values.depthTest,

} );

////////////////////////////////////////////////////////////////////////////////
// Basic system
////////////////////////////////////////////////////////////////////////////////

SystemSettings.basic = {

    // Particle material
    particleMaterial : SystemSettings.standardMaterial,

    // Initialization
    initializerFunction : SphereInitializer,
    initializerSettings : {
        sphere: new THREE.Vector4 ( 0.0, 0.0, 0.0, 10.0),
        color:    new THREE.Vector4 ( 1.0, 1.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 0.0, 0.0),
        lifetime: 7,
        size:     6.0,
    },

    // Update
    updaterFunction : EulerUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {},
    },

    // Scene
    maxParticles :  1000,
    particlesFreq : 100,
    createScene : function () {},
};


////////////////////////////////////////////////////////////////////////////////
// Fountain system
////////////////////////////////////////////////////////////////////////////////

SystemSettings.fountainBounce = {

    // Particle material
    particleMaterial :  SystemSettings.standardMaterial,

    // Initialization
    initializerFunction : FountainInitializer,
    initializerSettings : {
        sphere:   new THREE.Vector4 ( 0.0, 30.0, 0.0, 1.0 ),
        color:    new THREE.Vector4 ( 0.0, 0.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 30.0, 0.0),
        lifetime: 7,
        size:     5.0,
    },

    // Update
    updaterFunction : EulerUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, -20, 0),
            attractors : [],
        },
        collidables: {
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 0.8 } ],
        },
    },

    // Scene
    maxParticles :  5000,
    particlesFreq : 500,
    createScene : function () {
        var plane_geo = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
        var phong     = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x222222, side: THREE.DoubleSide } );

        var box_geo   = new THREE.BoxGeometry(10,30,10)

        var plane     = new THREE.Mesh( plane_geo, phong );
        var box       = new THREE.Mesh( box_geo, phong );
        box.position.set( 0.0, 15.0, 0.0 );

        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );
        Scene.addObject( box );
    },
};

SystemSettings.fountainSink = {

    // Particle material
    particleMaterial :  SystemSettings.standardMaterial,

    // Initialization
    initializerFunction : FountainInitializer,
    initializerSettings : {
        sphere:   new THREE.Vector4 ( 0.0, 30.0, 0.0, 1.0 ),
        color:    new THREE.Vector4 ( 0.0, 0.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 30.0, 0.0),
        lifetime: 7,
        size:     5.0,
    },

    // Update
    updaterFunction : EulerUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, -20, 0),
            attractors : [],
        },
        collidables: {
            sinkPlanes : [ { plane : new THREE.Vector4( 0, 1, 0, 0 ) } ],
        },
    },

    // Scene
    maxParticles :  5000,
    particlesFreq : 500,
    createScene : function () {
        var plane_geo = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
        var phong     = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x222222, side: THREE.DoubleSide } );

        var box_geo   = new THREE.BoxGeometry(10,30,10)

        var plane     = new THREE.Mesh( plane_geo, phong );
        var box       = new THREE.Mesh( box_geo, phong );
        box.position.set( 0.0, 15.0, 0.0 );

        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );
        Scene.addObject( box );
    },
};

////////////////////////////////////////////////////////////////////////////////
// Attractor system
////////////////////////////////////////////////////////////////////////////////

SystemSettings.attractor = {

    // Particle material
    particleMaterial : SystemSettings.standardMaterial,

    // Initialization
    initializerFunction : SphereInitializer,
    initializerSettings : {
        sphere:   new THREE.Vector4 ( 0.0, 0.0, 0.0, 5.0),
        color:    new THREE.Vector4 ( 1.0, 1.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 0.0, 0.0),
        lifetime: 7,
        size:     6.0,
    },

    // Update
    updaterFunction : EulerUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [ new THREE.Sphere( new THREE.Vector3(30.0, 30.0, 30.0), 15.0 ) ],
        },
        collidables: {},
    },

    // Scene
    maxParticles :  10000,
    particlesFreq : 1000,
    createScene : function () {
        var sphere_geo = new THREE.SphereGeometry( 1.0, 32, 32 );
        var phong      = new THREE.MeshPhongMaterial( {color: 0x444444, emissive:0x442222, side: THREE.DoubleSide } );
        var sphere = new THREE.Mesh( sphere_geo, phong )

        sphere.position.set (30.0, 30.0, 30.0);
        Scene.addObject( sphere );
    },
};

////////////////////////////////////////////////////////////////////////////////
// Horse animation
////////////////////////////////////////////////////////////////////////////////

SystemSettings.animated = {

    // Particle Material
    particleMaterial :  SystemSettings.standardMaterial,

    // Initializer
    initializerFunction : AnimationInitializer,
    initializerSettings : {
        position: new THREE.Vector3 ( 0.0, 60.0, 0.0),
        color:    new THREE.Vector4 ( 1.0, 1.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 0.0, -40.0),
        lifetime: 1.25,
        size:     2.0,
    },

    // Updater
    updaterFunction : EulerUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 0.8 } ],
        },
    },

    // Scene
    // maxParticles:  200,
    // particlesFreq: 100,
    maxParticles:  20000,
    particlesFreq: 10000,
    createScene : function () {
        var plane_geo = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
        var phong     = new THREE.MeshPhongMaterial( {color: 0x444444, emissive:0x444444, side: THREE.DoubleSide } );
        var plane = new THREE.Mesh( plane_geo, phong );
        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );
    },

    // Animation
    animatedModelName: "animated_models/horse.js",
    animationLoadFunction : function( geometry ) {

        mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true, transparent:true, opacity:0.5 } ) );
        mesh.scale.set( 0.25, 0.25, 0.25 );
        // mesh.position.set( 0.0, 30.0, 0.0 );
        Scene.addObject( mesh );
        ParticleEngine.addMesh( mesh );

        ParticleEngine.addAnimation( new THREE.MorphAnimation( mesh ) );
    },

};


////////////////////////////////////////////////////////////////////////////////
// Cloth
////////////////////////////////////////////////////////////////////////////////

SystemSettings.cloth = {

    // Particle Material
    particleMaterial :  new THREE.MeshLambertMaterial( { color:0xff0000, side: THREE.DoubleSide  } ),

    // Initializer
    initializerFunction : ClothInitializer,
    initializerSettings : {
        position: new THREE.Vector3 ( 0.0, 60.0, 0.0),
        color:    new THREE.Vector4 ( 1.0, 0.0, 0.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 0.0, 0.0),
    },

    // Updater
    updaterFunction : ClothUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, -10.0, 0),
            attractors : [],
        },
        collidables: {
            bounceSpheres: [ {sphere : new THREE.Vector4( 0, 0, 0, 52.0 ), damping : 0.0 } ],
        },
    },

    // Scene
    maxParticles:  400,
    particlesFreq: 1000,
    createScene : function () {
        var sphere_geo = new THREE.SphereGeometry( 50.0, 32, 32 );
        var phong      = new THREE.MeshPhongMaterial( {color: 0x444444, emissive:0x442222, side: THREE.DoubleSide } );

        Scene.addObject( new THREE.Mesh( sphere_geo, phong ) );

    },

    // Cloth specific settings
    cloth : true,
    width : 20,
    height : 20,
};

////////////////////////////////////////////////////////////////////////////////
// My System
////////////////////////////////////////////////////////////////////////////////

var roomHeight = 600;
var roomWidth = 1200;
var roomDepth = 2000;
var y_offset = -roomHeight / 2;

var numCols = 7;
var numRows = 7;
var brickHeight = 25;
var brickDepth = 20;
var brickWidth = roomWidth / numCols;
var spacing = 5;
var yOffset = roomHeight / 2 - (brickHeight * numRows) - spacing - 10;
var bricks = [];
var bricks_2 = [];

var distBetween = 50;

for (var j = 0; j < numRows; j++) {
    for (var i = 0; i < numCols; i++) {
        var idx = (j * numCols) + i;
        bricks[idx] = {};
        bricks[idx].box = { xMin: brickWidth * i - (roomWidth / 2) + spacing,
                            xMax: brickWidth * (i + 1) - (roomWidth / 2) - spacing,
                            yMin: j * brickHeight + spacing + yOffset,
                            yMax: (j + 1) * brickHeight - spacing + yOffset,
                            // zMin: distFromCenter,
                            // zMax: distFromCenter + brickDepth,
                            zMin: -brickDepth / 2 + brickDepth / 2 + distBetween,
                            zMax: brickDepth / 2 + brickDepth / 2 + distBetween,
                            alive: true,
                            player : 1
                        };
                        // console.log((bricks[idx].box.zMin + bricks[idx].box.zMax )/ 2);
        bricks[idx].damping = 1;
        bricks_2[idx] = {};
        bricks_2[idx].box = { xMin: brickWidth * i - (roomWidth / 2) + spacing,
                            xMax: brickWidth * (i + 1) - (roomWidth / 2) - spacing,
                            yMin: j * brickHeight + spacing + yOffset,
                            yMax: (j + 1) * brickHeight - spacing + yOffset,
                            // zMin: -distFromCenter,
                            // zMax: -distFromCenter - brickDepth / 2,
                            zMin: -brickDepth / 2 - brickDepth / 2 - distBetween,
                            zMax: brickDepth / 2 - brickDepth / 2 - distBetween,
                            alive: true,
                            player : 2
                        };
                        // console.log((bricks_2[idx].box.zMin + bricks[idx].box.zMax )/ 2);
        bricks_2[idx].damping = 1;    }
}


var platformWidth = brickWidth * 1.2;
var platformHeight = 10;
var platformDepth = brickDepth;
var platformPosition = new THREE.Vector3(0, -roomHeight / 2, brickDepth / 2 + distBetween);
var platformPosition_2 = new THREE.Vector3(0, -roomHeight / 2, - brickDepth / 2 - distBetween);
// var platformPosition = new THREE.Vector3(0, -roomHeight / 2 + 20, brickDepth / 2 + spacing);
// var platformPosition_2 = new THREE.Vector3(0, -roomHeight / 2 + 20, - brickDepth / 2 - spacing);
// console.log(platformPosition, platformPosition_2);
var platformBox = { xMin: platformPosition.x - platformWidth / 2,
                    xMax: platformPosition.x + platformWidth / 2,
                    yMin: platformPosition.y - platformHeight / 2,
                    yMax: platformPosition.y + platformHeight / 2,
                    zMin: platformPosition.z - platformDepth / 2 - 10,
                    zMax: platformPosition.z + platformDepth / 2,
                    player: 1
                    };
var platformBox_2 = {   xMin: platformPosition_2.x - platformWidth / 2,
                        xMax: platformPosition_2.x + platformWidth / 2,
                        yMin: platformPosition_2.y - platformHeight / 2,
                        yMax: platformPosition_2.y + platformHeight / 2,
                        zMin: platformPosition_2.z - platformDepth / 2,
                        zMax: platformPosition_2.z + platformDepth / 2 + 10,
                        player: 2
                        };

// console.log(bricks.length);

var numPowerups = 20;
// var powerupsPerGame = 5;
// var powerupLifetime = 10;

var emissive = 0x343434;
var emissivePowerup = 0xbbbbbb;
var freezeMaterial = new THREE.MeshPhongMaterial( {color: 0x777777, emissive: emissivePowerup, side: THREE.DoubleSide } );

var material_player1_normal = new THREE.MeshPhongMaterial( {color: 0x00FF50, emissive: emissive, side: THREE.DoubleSide } );
var material_player1_light  = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );
var material_player1_dark   = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );

var material_player2_normal = new THREE.MeshPhongMaterial( {color: 0xCC3399, emissive: emissive, side: THREE.DoubleSide } );
var material_player2_light  = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );
var material_player2_dark   = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );

// normal, 2x score, widen platform, freeze opponent, add ball
var material_powerups   = [[material_player1_normal, material_player2_normal], new THREE.MeshPhongMaterial( {color: 0xFF0000, emissive: emissivePowerup, side: THREE.DoubleSide } ), new THREE.MeshPhongMaterial( {color: 0x0000FF, emissive: emissivePowerup, side: THREE.DoubleSide } ), freezeMaterial, new THREE.MeshPhongMaterial( {color: 0x0066FF, emissive: emissivePowerup, side: THREE.DoubleSide } )];
var material_probs = [40, 2, 3, 2, 3];
var material_probs_total = 0;
for (var i = 0; i < material_probs.length; i++) {
    material_probs_total += material_probs[i];
}
// var material_powerups   = [null, new THREE.MeshPhongMaterial( {color: 0xFF0000, emissive: emissivePowerup, side: THREE.DoubleSide } ), new THREE.MeshPhongMaterial( {color: 0x0000FF, emissive: emissivePowerup, side: THREE.DoubleSide } )];


SystemSettings.mySystem = {
    particleMaterial :  SystemSettings.standardMaterial,
    roomWidth : roomWidth,
    baseScore : 100,
    basePenalty : 250,
    gameLifetime : 60,
    currLifetime : 60,
    powerupLifetime: 5,
    player1_cur2xPointsLifetime : 0,
    player2_cur2xPointsLifetime : 0,
    widePlatformFactor : 1.5,
    player1_curWideLifetime : 0,
    player2_curWideLifetime : 0,
    freezeLifetime : 2,
    freezeMaterial : freezeMaterial,
    player1_curFreezeLifetime : 0,
    player2_curFreezeLifetime : 0,
    isPlayGame : true,
    platformsStartPos : [platformPosition, platformPosition_2],
    platformWidth : platformWidth,
    player1_numBalls : 0,
    player2_numBalls : 0,
    material_probs : material_probs,
    material_probs_total : material_probs_total,

    // Initialization
    initializerFunction : SphereInitializer,
    initializerSettings : {
        sphere: new THREE.Vector4 ( 0, 0, 0, 3.0),
        color:    new THREE.Vector4 ( 1.0, 1.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 0.0, 0.0),
        lifetime: 7,
        size:     100.0,
    },

    // Update
    updaterFunction : EulerUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {
            // sinkPlanes: [ {plane : new THREE.Vector4( 0, 1, 0, y_offset ), damping : 1.0 } ],
            bouncePlanes: [
                            {plane : new THREE.Vector4( 0, -1, 0, roomHeight + y_offset ), damping : 1.0 },
                            {plane : new THREE.Vector4( 1, 0, 0, -roomWidth / 2 ), damping : 1.0 },
                            {plane : new THREE.Vector4( -1, 0, 0, roomWidth / 2 ), damping : 1.0 },
                            ],
            sinkPlanes: [{plane : new THREE.Vector4( 0, 1, 0, y_offset ), damping : 1.0 }],
            bounceBoxes: bricks.concat(bricks_2),
            bouncePlatforms: [platformBox, platformBox_2]
        },
    },

    // Scene
    maxParticles :  20,
    particlesFreq : 100,

    createScene : function () {
        // var emissive = 0x343434;
        // var emissivePowerup = 0xaaaaaa;

        // var material_player1_normal = new THREE.MeshPhongMaterial( {color: 0x00FF50, emissive: emissive, side: THREE.DoubleSide } );
        // var material_player1_light  = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );
        // var material_player1_dark   = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );

        // var material_player2_normal = new THREE.MeshPhongMaterial( {color: 0xCC3399, emissive: emissive, side: THREE.DoubleSide } );
        // var material_player2_light  = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );
        // var material_player2_dark   = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );

        // var material_powerups   = [null, new THREE.MeshPhongMaterial( {color: 0xFF0000, emissive: emissivePowerup, side: THREE.DoubleSide } )];

        // var material_powerups   = [null, new THREE.MeshPhongMaterial( {color: 0xFF0000, emissive: emissivePowerup, side: THREE.DoubleSide } ), new THREE.MeshPhongMaterial( {color: 0x0000FF, emissive: emissivePowerup, side: THREE.DoubleSide } ), this.freezeMaterial];

        // Ceiling
        var plane_geo_top = new THREE.PlaneBufferGeometry( roomWidth, roomDepth / 2, 1, 1 );
        var plane_top     = new THREE.Mesh( plane_geo_top, material_player1_light );
        plane_top.rotation.x = Math.PI / 2;
        plane_top.position.y = roomHeight + y_offset;
        plane_top.position.z = roomDepth / 4;
        Scene.addObject( plane_top );

        var plane_geo_top2 = new THREE.PlaneBufferGeometry( roomWidth, roomDepth / 2, 1, 1 );
        var plane_top2     = new THREE.Mesh( plane_geo_top2, material_player2_light );
        plane_top2.rotation.x = Math.PI / 2;
        plane_top2.position.y = roomHeight + y_offset;
        plane_top2.position.z = -roomDepth / 4;
        Scene.addObject( plane_top2 );

        // Floor (make this a sink plane?)
        var plane_geo_bottom = new THREE.PlaneBufferGeometry( roomWidth, roomDepth / 2, 1, 1 );
        var plane_bottom     = new THREE.Mesh( plane_geo_bottom, material_player1_dark );
        plane_bottom.rotation.x = -Math.PI / 2;
        plane_bottom.position.y = 0 + y_offset;
        plane_bottom.position.z = roomDepth / 4;
        Scene.addObject( plane_bottom );

        var plane_geo_bottom2 = new THREE.PlaneBufferGeometry( roomWidth, roomDepth / 2, 1, 1 );
        var plane_bottom2     = new THREE.Mesh( plane_geo_bottom, material_player2_dark );
        plane_bottom2.rotation.x = -Math.PI / 2;
        plane_bottom2.position.y = 0 + y_offset;
        plane_bottom2.position.z = -roomDepth / 4;
        Scene.addObject( plane_bottom2 );

        // Left wall
        var plane_geo_left = new THREE.PlaneBufferGeometry( roomDepth / 2, roomHeight, 1, 1 );
        var plane_left     = new THREE.Mesh( plane_geo_left, material_player1_light );
        plane_left.rotation.y = Math.PI / 2;
        plane_left.position.x = -roomWidth / 2;
        plane_left.position.y = roomHeight / 2 + y_offset;
        plane_left.position.z = roomDepth / 4;
        Scene.addObject( plane_left );

        var plane_geo_left2 = new THREE.PlaneBufferGeometry( roomDepth / 2, roomHeight, 1, 1 );
        var plane_left2     = new THREE.Mesh( plane_geo_left2, material_player2_light );
        plane_left2.rotation.y = Math.PI / 2;
        plane_left2.position.x = -roomWidth / 2;
        plane_left2.position.y = roomHeight / 2 + y_offset;
        plane_left2.position.z = -roomDepth / 4;
        Scene.addObject( plane_left2 );

        // Right wall
        var plane_geo_right = new THREE.PlaneBufferGeometry( roomDepth / 2, roomHeight, 1, 1 );
        var plane_right     = new THREE.Mesh( plane_geo_right, material_player1_light );
        plane_right.rotation.y = -Math.PI / 2;
        plane_right.position.x = roomWidth / 2;
        plane_right.position.y = roomHeight / 2 + y_offset;
        plane_right.position.z = roomDepth / 4;
        Scene.addObject( plane_right );

        var plane_geo_right2 = new THREE.PlaneBufferGeometry( roomDepth / 2, roomHeight, 1, 1 );
        var plane_right2     = new THREE.Mesh( plane_geo_right2, material_player2_light );
        plane_right2.rotation.y = -Math.PI / 2;
        plane_right2.position.x = roomWidth / 2;
        plane_right2.position.y = roomHeight / 2 + y_offset;
        plane_right2.position.z = -roomDepth / 4;
        Scene.addObject( plane_right2 );

        // Back walls
        var plane_geo_back = new THREE.PlaneBufferGeometry( roomWidth, roomHeight, 1, 1 );
        var plane_back     = new THREE.Mesh( plane_geo_back, material_player1_light );
        plane_back.rotation.y = 0;
        plane_back.position.y = roomHeight / 2 + y_offset;
        plane_back.position.z = roomDepth / 2;
        Scene.addObject( plane_back );

        var plane_geo_back2 = new THREE.PlaneBufferGeometry( roomWidth, roomHeight, 1, 1 );
        var plane_back2     = new THREE.Mesh( plane_geo_back2, material_player2_light );
        plane_back2.rotation.y = 0;
        plane_back2.position.y = roomHeight / 2 + y_offset;
        plane_back2.position.z = -roomDepth / 2;
        Scene.addObject( plane_back2 );

        // Add bricks
        for (var i = 0; i < bricks.length; i++) {
            var powerup = Math.random() * material_probs_total;
            var probSum = 0;
            for (var j = 0; j < material_probs.length; j++) {
                probSum += material_probs[j];
                if (powerup < probSum) {
                    powerup = j;
                    break;
                }
            }
            var material = material_player1_normal;
            if (powerup > 0) {
                material = material_powerups[powerup];
            }

            var bound = bricks[i].box;
            var box_geo   = new THREE.BoxGeometry(bound.xMax - bound.xMin, bound.yMax - bound.yMin, bound.zMax - bound.zMin);
            var box       = new THREE.Mesh( box_geo, material );
            box.position.set( (bound.xMin + bound.xMax) / 2, (bound.yMin + bound.yMax) / 2, (bound.zMin + bound.zMax) / 2 );
            Scene.addObject( box );
            bound.mesh = box;
            bound.powerup = powerup;
        }

        // Add bricks
        for (var i = 0; i < bricks_2.length; i++) {
            var powerup = Math.random() * material_probs_total;
            var probSum = 0;
            for (var j = 0; j < material_probs.length; j++) {
                probSum += material_probs[j];
                if (powerup < probSum) {
                    powerup = j;
                    break;
                }
            }
            var material = material_player2_normal;
            if (powerup > 0) {
                material = material_powerups[powerup];
            }

            var bound = bricks_2[i].box;
            var box_geo   = new THREE.BoxGeometry(bound.xMax - bound.xMin, bound.yMax - bound.yMin, bound.zMax - bound.zMin);
            var box       = new THREE.Mesh( box_geo, material );
            box.position.set( (bound.xMin + bound.xMax) / 2, (bound.yMin + bound.yMax) / 2, (bound.zMin + bound.zMax) / 2 );
            Scene.addObject( box );
            bound.mesh = box;
            bound.powerup = powerup;
        }

        // Add player 1 platform
        var platform_geo   = new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth);
        var platform       = new THREE.Mesh( platform_geo, material_player1_normal );
        platform.position.set( platformPosition.x, platformPosition.y, platformPosition.z);
        Scene.addObject( platform );
        platformBox.mesh = platform;
        this.player1_platform = {
            geo: platform_geo,
            mesh: platform,
            material: material_player1_normal
        }
        this.material_platformDefault1 = material_player1_normal;

        // Add player 2 platform
        var platform_geo_2   = new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth);
        var platform_2       = new THREE.Mesh( platform_geo_2, material_player2_normal );
        platform_2.position.set( platformPosition_2.x, platformPosition_2.y, platformPosition_2.z);
        Scene.addObject( platform_2 );
        platformBox_2.mesh = platform_2;
        this.player2_platform = {
            geo: platform_geo_2,
            mesh: platform_2,
            material: material_player2_normal
        }
        this.material_platformDefault2 = material_player2_normal;

        // Add player 1 center line
        var center_line_geo = new THREE.BoxGeometry(roomWidth, spacing / 2, spacing);
        var center_line     = new THREE.Mesh(center_line_geo, material_player1_normal);
        center_line.position.set(platformPosition.x, platformPosition.y, platformPosition.z);
        Scene.addObject(center_line);

        // Add player 2 center line
        var center_line_geo_2 = new THREE.BoxGeometry(roomWidth, spacing / 2, spacing);
        var center_line_2     = new THREE.Mesh(center_line_geo_2, material_player2_normal);
        center_line_2.position.set(platformPosition_2.x, platformPosition_2.y, platformPosition_2.z);
        Scene.addObject(center_line_2);
    },
    materialPowerups : material_powerups,
};
