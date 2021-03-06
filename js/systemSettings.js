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
// My System
////////////////////////////////////////////////////////////////////////////////

var roomHeight = 600;
var roomWidth = 1200;
var roomDepth = 1600;
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
                            zMin: -brickDepth / 2 + brickDepth / 2 + distBetween,
                            zMax: brickDepth / 2 + brickDepth / 2 + distBetween,
                            alive: true,
                            player : 1
                        };
        bricks[idx].damping = 1;
        bricks_2[idx] = {};
        bricks_2[idx].box = { xMin: brickWidth * i - (roomWidth / 2) + spacing,
                            xMax: brickWidth * (i + 1) - (roomWidth / 2) - spacing,
                            yMin: j * brickHeight + spacing + yOffset,
                            yMax: (j + 1) * brickHeight - spacing + yOffset,
                            zMin: -brickDepth / 2 - brickDepth / 2 - distBetween,
                            zMax: brickDepth / 2 - brickDepth / 2 - distBetween,
                            alive: true,
                            player : 2
                        };
        bricks_2[idx].damping = 1;    }
}


var platformWidth = brickWidth * 1.2;
var platformHeight = 10;
var platformDepth = brickDepth;
var platformPosition = new THREE.Vector3(0, -roomHeight / 2, brickDepth / 2 + distBetween);
var platformPosition_2 = new THREE.Vector3(0, -roomHeight / 2, - brickDepth / 2 - distBetween);

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

var emissive = 0x343434;
var emissivePowerup = 0xbbbbbb;
var scoreMaterial = new THREE.MeshPhongMaterial( {color: 0xFF0000, emissive: emissivePowerup, side: THREE.DoubleSide } );
var wideMaterial = new THREE.MeshPhongMaterial( {color: 0x0000FF, emissive: emissivePowerup, side: THREE.DoubleSide } );
var freezeMaterial = new THREE.MeshPhongMaterial( {color: 0x0066FF, emissive: emissivePowerup, side: THREE.DoubleSide } );
var ballMaterial = new THREE.MeshPhongMaterial( {color: 0x00FF00, emissive: emissivePowerup, side: THREE.DoubleSide } );

var material_player1_normal = new THREE.MeshPhongMaterial( {color: 0x00FF50, emissive: emissive, side: THREE.DoubleSide } );
var material_player1_light  = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );
var material_player1_dark   = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );

var material_player2_normal = new THREE.MeshPhongMaterial( {color: 0xCC3399, emissive: emissive, side: THREE.DoubleSide } );
var material_player2_light  = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );
var material_player2_dark   = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, emissive: emissive, side: THREE.DoubleSide } );

// order of powerups: normal, 2x score, widen platform, freeze opponent, add ball
var material_powerups   = [[material_player1_normal, material_player2_normal], scoreMaterial, wideMaterial, freezeMaterial, ballMaterial];
var material_probs = [40, 2, 3, 2, 3];
var material_probs_total = 0;
for (var i = 0; i < material_probs.length; i++) {
    material_probs_total += material_probs[i];
}

SystemSettings.mySystem = {
    particleMaterial :  SystemSettings.standardMaterial,
    roomWidth : roomWidth,
    baseScore : 100,
    basePenalty : 250,
    gameLifetime : 30,
    currLifetime : 30,
    powerupLifetime: 7,
    player1_cur2xPointsLifetime : 0,
    player2_cur2xPointsLifetime : 0,
    widePlatformFactor : 1.5,
    player1_curWideLifetime : 0,
    player2_curWideLifetime : 0,
    freezeLifetime : 2,
    freezeMaterial : freezeMaterial,
    player1_curFreezeLifetime : 0,
    player2_curFreezeLifetime : 0,
    isPlayGame : false,
    platformsStartPos : [platformPosition, platformPosition_2],
    platformWidth : platformWidth,
    player1_numBalls : 0,
    player2_numBalls : 0,
    material_probs : material_probs,
    material_probs_total : material_probs_total,

    // Initialization
    initializerFunction : BallInitializer,
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

        // Floor
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
            var numPowerups = Math.round(material_probs[j] / material_probs_total * bricks.length);
            for (var k = 0; k < numPowerups; k++) {
                powerups.push(j);
                count++;
            }
        }
        for (var j = count; j < bricks.length; j++) {
            powerups.push(0);
        }
        // randomize powerups
        var shuffledPowerups = shuffleArray(powerups);

        // Add bricks
        for (var i = 0; i < bricks.length; i++) {
            var powerup = shuffledPowerups[i];
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
            // make the back of bricks all the same color
            var back_brick_geo = new THREE.BoxGeometry(bound.xMax - bound.xMin, bound.yMax - bound.yMin, bound.zMax - bound.zMin);
            var back_brick = new THREE.Mesh(back_brick_geo, material_player1_normal);
            back_brick.position.set(box.position.x, box.position.y, bound.zMin - 0.1);
            Scene.addObject(back_brick);
            bound.backMesh = back_brick;
            bound.powerup = powerup;
        }

        // determine number of each powerup
        powerups = [];
        count = 0;
        for (var j = 1; j < material_probs.length; j++) {
            var numPowerups = Math.round(material_probs[j] / material_probs_total * bricks_2.length);
            for (var k = 0; k < numPowerups; k++) {
                powerups.push(j);
                count++;
            }
        }
        for (var j = count; j < bricks_2.length; j++) {
            powerups.push(0);
        }
        // randomize powerups
        shuffledPowerups = shuffleArray(powerups);

        // Add bricks
        for (var i = 0; i < bricks_2.length; i++) {
            var powerup = shuffledPowerups[i];
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
            // make the back of bricks the same color
            var back_brick_geo = new THREE.BoxGeometry(bound.xMax - bound.xMin, bound.yMax - bound.yMin, bound.zMax - bound.zMin);
            var back_brick = new THREE.Mesh(back_brick_geo, material_player2_normal);
            back_brick.position.set(box.position.x, box.position.y, bound.zMax + 0.1);
            Scene.addObject(back_brick);
            bound.backMesh = back_brick;
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
