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

var roomHeight = 300;
var roomWidth = 500;
var roomDepth = 300;
var y_offset = -roomHeight / 2;

var numCols = 10;
var numRows = 5;
var brickHeight = 15;
var brickDepth = 20;
var brickWidth = roomWidth / numCols;
var spacing = 2;
var yOffset = roomHeight / 2 - (brickHeight * numRows) - spacing - 10;
var bricks = [];

for (var j = 0; j < numRows; j++) {
    for (var i = 0; i < numCols; i++) {
        var idx = (j * numCols) + i;
        bricks[idx] = {};
        bricks[idx].box = { xMin: brickWidth * i - (roomWidth / 2) + spacing,
                            xMax: brickWidth * (i + 1) - (roomWidth / 2) - spacing,
                            yMin: j * brickHeight + spacing + yOffset,
                            yMax: (j + 1) * brickHeight - spacing + yOffset,
                            zMin: -brickDepth / 2,
                            zMax: brickDepth / 2,
                            alive: true
                        };
        bricks[idx].damping = 1;
        // bricks[idx].alive = true;
    }
}

var platformWidth = brickWidth * 1.5;
var platformHeight = 5;
var platformDepth = brickDepth;
var platformPosition = new THREE.Vector3(0, -roomHeight / 2 + 20, 0);

// console.log(bricks.length);

SystemSettings.mySystem = {
    // Particle material
    particleMaterial :  SystemSettings.standardMaterial,

    // // Initialization
    // initializerFunction : FountainInitializer,
    // initializerSettings : {
    //     sphere:   new THREE.Vector4 ( 0.0, 30.0, 0.0, 1.0 ),
    //     color:    new THREE.Vector4 ( 0.0, 0.0, 1.0, 1.0 ),
    //     velocity: new THREE.Vector3 ( 0.0, 30.0, 0.0),
    //     lifetime: 7,
    //     size:     5.0,
    // },

    // Initialization
    initializerFunction : SphereInitializer,
    initializerSettings : {
        sphere: new THREE.Vector4 ( 0, 0, 0, 3.0),
        color:    new THREE.Vector4 ( 1.0, 1.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 0.0, 0.0),
        lifetime: 100,
        size:     50.0,
    },

    // Update
    updaterFunction : EulerUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {
            bouncePlanes: [
                            {plane : new THREE.Vector4( 0, 1, 0, y_offset ), damping : 1.0 },
                            {plane : new THREE.Vector4( 0, -1, 0, roomHeight + y_offset ), damping : 1.0 },
                            {plane : new THREE.Vector4( 1, 0, 0, -roomWidth / 2 ), damping : 1.0 },
                            {plane : new THREE.Vector4( -1, 0, 0, roomWidth / 2 ), damping : 1.0 },
                            ],
            bounceBoxes: bricks,
            bouncePlatform: {   xMin: platformPosition.x - platformWidth / 2,
                                xMax: platformPosition.x + platformWidth / 2,
                                yMin: platformPosition.y - platformHeight / 2,
                                yMax: platformPosition.y + platformHeight / 2,
                                zMin: platformPosition.z - platformDepth / 2,
                                zMax: platformPosition.z + platformDepth / 2
                            }
        },
    },

    // Scene
    maxParticles :  10,
    particlesFreq : 100,
    createScene : function () {
        var material_red     = new THREE.MeshPhongMaterial( {color: 0xFF0000, emissive: 0x222222, side: THREE.DoubleSide } );
        var material_blue     = new THREE.MeshPhongMaterial( {color: 0xabcdef, emissive: 0x222222, side: THREE.DoubleSide } );
        var material_green     = new THREE.MeshPhongMaterial( {color: 0x00FF00, emissive: 0x222222, side: THREE.DoubleSide } );

        // Ceiling
        var plane_geo_top = new THREE.PlaneBufferGeometry( roomWidth, roomDepth, 1, 1 );
        var plane_top     = new THREE.Mesh( plane_geo_top, material_blue );
        plane_top.rotation.x = Math.PI / 2;
        plane_top.position.y = roomHeight + y_offset;
        Scene.addObject( plane_top );

        // Floor (make this a sink plane?)
        var plane_geo_bottom = new THREE.PlaneBufferGeometry( roomWidth, roomDepth, 1, 1 );
        var plane_bottom     = new THREE.Mesh( plane_geo_bottom, material_blue );
        plane_bottom.rotation.x = -Math.PI / 2;
        plane_bottom.position.y = 0 + y_offset;
        Scene.addObject( plane_bottom );

        // Left wall
        var plane_geo_left = new THREE.PlaneBufferGeometry( roomDepth, roomHeight, 1, 1 );
        var plane_left     = new THREE.Mesh( plane_geo_left, material_red );
        plane_left.rotation.y = Math.PI / 2;
        plane_left.position.x = -roomWidth / 2;
        plane_left.position.y = roomHeight / 2 + y_offset;
        Scene.addObject( plane_left );

        // Right wall
        var plane_geo_right = new THREE.PlaneBufferGeometry( roomDepth, roomHeight, 1, 1 );
        var plane_right     = new THREE.Mesh( plane_geo_right, material_red );
        plane_right.rotation.y = -Math.PI / 2;
        plane_right.position.x = roomWidth / 2;
        plane_right.position.y = roomHeight / 2 + y_offset;
        Scene.addObject( plane_right );

        // Add bricks
        for (var i = 0; i < bricks.length; i++) {
            var bound = bricks[i].box;

            var box_geo   = new THREE.BoxGeometry(bound.xMax - bound.xMin, bound.yMax - bound.yMin, bound.zMax - bound.zMin);
            var box       = new THREE.Mesh( box_geo, material_green );
            box.position.set( (bound.xMin + bound.xMax) / 2, (bound.yMin + bound.yMax) / 2, (bound.zMin + bound.zMax) / 2 );
            Scene.addObject( box );
            bound.mesh = box;
        }

        // Add platform
        var platform_geo   = new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth);
        var platform       = new THREE.Mesh( platform_geo, material_red );
        platform.position.set( platformPosition.x, platformPosition.y, platformPosition.z );
        Scene.addObject( platform );

    },

};
