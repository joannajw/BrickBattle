/*
 * In this file you can specify all sort of updaters
 *  We provide an example of simple updater that updates pixel positions based on initial velocity and gravity
 */

////////////////////////////////////////////////////////////////////////////////
// Collisions
////////////////////////////////////////////////////////////////////////////////

var applyRenderingEffects = false;
var Collisions = Collisions || {};

Collisions.BouncePlatform = function(particleAttributes, alive, delta_t, platform) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    var normal_xz_min = new THREE.Vector3(0, -1, 0);
    var normal_xz_max = new THREE.Vector3(0, 1, 0);

    var EPS = 0.1;

    for ( var i = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

        var newPos = pos.clone().add(vel.clone().multiplyScalar(delta_t));

        // only intersect if ball is falling downward
        if (vel.dot(normal_xz_max) < 0) {
            if ((newPos.x >= platform.xMin && newPos.x <= platform.xMax && newPos.z >= platform.zMin && newPos.z <= platform.zMax) ||
                (pos.x >= platform.xMin && pos.x <= platform.xMax && pos.z >= platform.zMin && pos.z <= platform.zMax)) {
                var dist = Math.abs(platform.yMax - pos.y);
                var len = Math.abs(newPos.y - pos.y);
                if (len > dist) {
                    // reflect differently depending on intersection position
                    var distFromCenter = (pos.x - (platform.xMin + platform.xMax) / 2) / (platform.xMax - platform.xMin);
                    var newNormal = (new THREE.Vector3(1, 0, 0)).multiplyScalar(distFromCenter).add(normal_xz_max).normalize();
                    var velMagnitude = vel.length();
                    vel.reflect(newNormal);
                    // don't let ball bounce more than 30 degrees
                    if (Math.abs(vel.x / vel.y) > Math.sqrt(3)) {
                        var factor = Math.sqrt(3);
                        if (vel.x < 0) {
                            factor *= -1;
                        }
                        vel.x = Math.abs(vel.y) * factor;
                    }
                    var factor = velMagnitude / vel.length();
                    vel.multiplyScalar(factor);
                }
            }
        }
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
    }
}

// powerup indices
var POWERUP_2XPOINTS = 1;
var POWERUP_WIDE = 2;
var POWERUP_FREEZE = 3;
var POWERUP_ADDBALL = 4;

Collisions.BounceBox = function(particleAttributes, alive, delta_t, box, damping) {

    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;
    var players      = particleAttributes.player;
    var colors       = particleAttributes.color;
    var sizes        = particleAttributes.size;
    var lifetimes    = particleAttributes.lifetime;

    var normal_yz_min = new THREE.Vector3(-1, 0, 0);
    var normal_yz_max = new THREE.Vector3(1, 0, 0);
    var normal_xz_min = new THREE.Vector3(0, -1, 0);
    var normal_xz_max = new THREE.Vector3(0, 1, 0);

    var EPS = 0.1;

    for ( var i = 0 ; i < alive.length ; ++i ) {
        // only intersect boxes in play
        if (!box.alive) {
            return;
        }
        if ( !alive[i] ) continue;
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );
        var player = getElement( i, players );

        var newPos = pos.clone().add(vel.clone().multiplyScalar(delta_t));
        var closestNormal = undefined;
        var closestDist = Number.POSITIVE_INFINITY;
        // top of box
        if (vel.dot(normal_xz_max) < 0) {
            if ((newPos.x >= box.xMin && newPos.x <= box.xMax && newPos.z >= box.zMin && newPos.z <= box.zMax) ||
                (pos.x >= box.xMin && pos.x <= box.xMax && pos.z >= box.zMin && pos.z <= box.zMax)) {
                var dist = Math.abs(box.yMax - pos.y);
                var len = Math.abs(newPos.y - pos.y);
                if (len > dist && dist < closestDist) {
                    closestNormal = normal_xz_max
                    closestDist = dist;
                }
            }
        }
        // bottom of box
        if (vel.dot(normal_xz_min) < 0) {
            if ((newPos.x >= box.xMin && newPos.x <= box.xMax && newPos.z >= box.zMin && newPos.z <= box.zMax) ||
                (pos.x >= box.xMin && pos.x <= box.xMax && pos.z >= box.zMin && pos.z <= box.zMax)) {
                var dist = Math.abs(box.yMin - pos.y);
                var len = Math.abs(newPos.y - pos.y);
                if (len > dist && dist < closestDist) {
                    closestNormal = normal_xz_min
                    closestDist = dist;
                }
            }
        }
        // right side of box
        if (vel.dot(normal_yz_max) < 0) {
            if ((newPos.y >= box.yMin && newPos.y <= box.yMax && newPos.z >= box.zMin && newPos.z <= box.zMax) ||
                (pos.y >= box.yMin && pos.y <= box.yMax && pos.z >= box.zMin && pos.z <= box.zMax)) {
                var dist = Math.abs(box.xMax - pos.x);
                var len = Math.abs(newPos.x - pos.x);
                if (len > dist && dist < closestDist) {
                    closestNormal = normal_yz_max
                    closestDist = dist;
                }
            }
        }
        // left side of box
        if (vel.dot(normal_yz_min) < 0) {
            if ((newPos.y >= box.yMin && newPos.y <= box.yMax && newPos.z >= box.zMin && newPos.z <= box.zMax) ||
                (pos.y >= box.yMin && pos.y <= box.yMax && pos.z >= box.zMin && pos.z <= box.zMax)) {
                var dist = Math.abs(box.xMin - pos.x);
                var len = Math.abs(newPos.x - pos.x);
                if (len > dist && dist < closestDist) {
                    closestNormal = normal_yz_min
                    closestDist = dist;
                }
            }
        }
        // reflect if intersection, remove box
        if (closestNormal != undefined) {
            vel.reflect(closestNormal);
            pos = pos.clone().sub(vel.clone().multiplyScalar(delta_t));
            box.alive = false;
            Scene.removeObject(box.mesh);
            Scene.removeObject(box.backMesh);

            // update score and apply any powerups
            if (player == 1) {
                var score = parseInt(document.getElementById("score").innerHTML);

                // start the 2x points powerup timer
                if (box.powerup == POWERUP_2XPOINTS) {
                    console.log("player 1 - 2x points powerup!");
                    SystemSettings.mySystem.player1_cur2xPointsLifetime = SystemSettings.mySystem.powerupLifetime;
                }

                // make the platform larger
                if (box.powerup == POWERUP_WIDE) {
                    console.log("player 1 - wide platform powerup!");
                    if (SystemSettings.mySystem.player1_curWideLifetime <= 0) {
                        var factor = SystemSettings.mySystem.widePlatformFactor;
                        var platformWidth = SystemSettings.mySystem.platformWidth;

                        var geo = SystemSettings.mySystem.player1_platform.geo;
                        var dims = new THREE.Vector3(geo.parameters.width, geo.parameters.height, geo.parameters.depth);
                        var mesh = SystemSettings.mySystem.player1_platform.mesh;
                        var position = mesh.position.clone();
                        var material = SystemSettings.mySystem.player1_platform.material;

                        Scene.removeObject(mesh);

                        geo = new THREE.BoxGeometry(dims.x * factor, dims.y, dims.z);
                        mesh = new THREE.Mesh( geo, material);
                        mesh.position.set(position.x, position.y, position.z);

                        Scene.addObject(mesh);

                        SystemSettings.mySystem.player1_platform = {
                            geo: geo,
                            mesh: mesh,
                            material: material
                        }

                        SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].xMin = position.x - platformWidth / 2 - (platformWidth * (factor - 1) / 2),
                        SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].xMax = position.x + platformWidth / 2 + (platformWidth * (factor - 1) / 2),
                        SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].mesh = mesh;
                    }
                    // set the wide platform powerup timer
                    SystemSettings.mySystem.player1_curWideLifetime = SystemSettings.mySystem.powerupLifetime;
                }

                // change the color of the opponent's platform to freeze
                if (box.powerup == POWERUP_FREEZE) {
                    console.log("player 1 - freeze platform powerup!");
                    if (SystemSettings.mySystem.player2_curFreezeLifetime <= 0) {
                        var freezeMaterial = SystemSettings.mySystem.freezeMaterial;
                        var geo = SystemSettings.mySystem.player2_platform.geo;
                        var dims = new THREE.Vector3(geo.parameters.width, geo.parameters.height, geo.parameters.depth);
                        var mesh = SystemSettings.mySystem.player2_platform.mesh;
                        var position = mesh.position.clone();

                        Scene.removeObject(mesh);

                        geo = new THREE.BoxGeometry(dims.x, dims.y, dims.z);
                        mesh = new THREE.Mesh( geo, freezeMaterial);
                        mesh.position.set(position.x, position.y, position.z);

                        Scene.addObject(mesh);

                        SystemSettings.mySystem.player2_platform = {
                            geo: geo,
                            mesh: mesh,
                            material: freezeMaterial
                        }

                        SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].mesh = mesh;
                    }
                    // set the freeze platform powerup timer
                    SystemSettings.mySystem.player2_curFreezeLifetime = SystemSettings.mySystem.freezeLifetime;
                }

                // add ball powerup
                if (box.powerup == POWERUP_ADDBALL) {
                    console.log("player 1 - add ball powerup!");
                    var idx;
                    // get first unused ball
                    for (var j = 0; j < alive.length; j++) {
                        if (getElement(j, players) != 1 && getElement(j, players) != 2 ) {
                            idx = j;
                            break;
                        }
                    }
                    // add that ball to player 1
                    setElement(idx, positions, pos);
                    setElement(idx, players, 1);
                    setElement(idx, velocities, vel.clone().multiplyScalar(-1));
                    setElement(idx, colors, new THREE.Vector4 ( 0.7, 1.0, 0.7, 1.0 ));
                    setElement(idx, sizes, getElement(i, sizes));
                    setElement(idx, lifetimes, getElement(i, lifetimes));
                    
                    SystemSettings.mySystem.player1_numBalls++;
                }

                // 2x points
                if (SystemSettings.mySystem.player1_cur2xPointsLifetime > 0) {
                    document.getElementById("score").innerHTML = score + (SystemSettings.mySystem.baseScore * 2) + " <span style='color:#ff0000'>(2x!)</span>";
                } else {
                    document.getElementById("score").innerHTML = score + SystemSettings.mySystem.baseScore;
                }
            }

            // update score and apply any powerups
            else if (player == 2) {
                var score = parseInt(document.getElementById("score_2").innerHTML);

                // start the 2x points powerup timer
                if (box.powerup == POWERUP_2XPOINTS) {
                    console.log("player 2 - 2x points powerup!");
                    SystemSettings.mySystem.player2_cur2xPointsLifetime = SystemSettings.mySystem.powerupLifetime;
                }

                // make the platform larger
                if (box.powerup == POWERUP_WIDE) {
                    console.log("player 2 - wide platform powerup!");

                    if (SystemSettings.mySystem.player2_curWideLifetime <= 0) {
                        var factor = SystemSettings.mySystem.widePlatformFactor;
                        var platformWidth = SystemSettings.mySystem.platformWidth;

                        var geo = SystemSettings.mySystem.player2_platform.geo;
                        var dims = new THREE.Vector3(geo.parameters.width, geo.parameters.height, geo.parameters.depth);
                        var mesh = SystemSettings.mySystem.player2_platform.mesh;
                        var position = mesh.position.clone();
                        var material = SystemSettings.mySystem.player2_platform.material;

                        Scene.removeObject(mesh);

                        geo = new THREE.BoxGeometry(dims.x * factor, dims.y, dims.z);
                        mesh = new THREE.Mesh( geo, material);
                        mesh.position.set(position.x, position.y, position.z);

                        Scene.addObject(mesh);

                        SystemSettings.mySystem.player2_platform = {
                            geo: geo,
                            mesh: mesh,
                            material: material
                        }

                        SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].xMin = position.x - platformWidth / 2 - (platformWidth * (factor - 1) / 2),
                        SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].xMax = position.x + platformWidth / 2 + (platformWidth * (factor - 1) / 2),
                        SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].mesh = mesh;
                    }
                    // set the wide platform powerup timer
                    SystemSettings.mySystem.player2_curWideLifetime = SystemSettings.mySystem.powerupLifetime;
                }

                // change the color of the opponent's platform to freeze
                if (box.powerup == POWERUP_FREEZE) {
                    console.log("player 2 - freeze platform powerup!");
                    if (SystemSettings.mySystem.player1_curFreezeLifetime <= 0) {
                        var freezeMaterial = SystemSettings.mySystem.freezeMaterial;
                        var geo = SystemSettings.mySystem.player1_platform.geo;
                        var dims = new THREE.Vector3(geo.parameters.width, geo.parameters.height, geo.parameters.depth);
                        var mesh = SystemSettings.mySystem.player1_platform.mesh;
                        var position = mesh.position.clone();

                        Scene.removeObject(mesh);

                        geo = new THREE.BoxGeometry(dims.x, dims.y, dims.z);
                        mesh = new THREE.Mesh( geo, freezeMaterial);
                        mesh.position.set(position.x, position.y, position.z);

                        Scene.addObject(mesh);

                        SystemSettings.mySystem.player1_platform = {
                            geo: geo,
                            mesh: mesh,
                            material: freezeMaterial
                        }

                        SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].mesh = mesh;
                    }
                    // set the freeze platform powerup timer
                    SystemSettings.mySystem.player1_curFreezeLifetime = SystemSettings.mySystem.freezeLifetime;
                }

                // add ball powerup
                if (box.powerup == POWERUP_ADDBALL) {
                    console.log("player 2 - add ball powerup!");
                    var idx;
                    // get first unused ball
                    for (var j = 0; j < alive.length; j++) {
                        if (getElement(j, players) != 1 && getElement(j, players) != 2 ) {
                            idx = j;
                            break;
                        }
                    }
                    // add that ball to player 2
                    setElement(idx, positions, pos);
                    setElement(idx, players, 2);
                    setElement(idx, velocities, vel.clone().multiplyScalar(-1));
                    setElement(idx, colors, new THREE.Vector4 ( 1.0, 0.8, 1.0, 1.0 ));
                    setElement(idx, sizes, getElement(i, sizes));
                    setElement(idx, lifetimes, getElement(i, lifetimes));
                    
                    SystemSettings.mySystem.player2_numBalls++;
                }

                // 2x points
                if (SystemSettings.mySystem.player2_cur2xPointsLifetime > 0) {
                    document.getElementById("score_2").innerHTML = score + (SystemSettings.mySystem.baseScore * 2) + " <span style='color:#ff0000'>(2x!)</span>";
                } else {
                    document.getElementById("score_2").innerHTML = score + SystemSettings.mySystem.baseScore;
                }
            }
        }
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
    }

}

// if collision with plane, return new position prior to collision
function intersectPlane(rayOrigin, velocity, plane, delta_t) {

    // check if the particle is on the same side of the plane normal
    var normal = new THREE.Vector3(plane.x, plane.y, plane.z).normalize();
    var direction = new THREE.Vector3(Math.abs(normal.x), Math.abs(normal.y), Math.abs(normal.z));
    var relPos = rayOrigin.clone().sub(direction.multiplyScalar(plane.w));
    // collision, so put particle back on other side of plane
    if (relPos.dot(normal) < 0) {
        return rayOrigin.clone().sub(velocity.clone().multiplyScalar(delta_t));
    }
    // no collision
    return undefined;
}

Collisions.BouncePlane = function ( particleAttributes, alive, delta_t, plane, damping ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

        var new_pos = intersectPlane(pos, vel, plane, delta_t);
        // collide with plane, bounce off
        if (new_pos != undefined) {
            var normal = new THREE.Vector3(plane.x, plane.y, plane.z).normalize();
            vel = vel.clone().reflect(normal).multiplyScalar(damping);
            pos = new_pos;
        }
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
    }
};

Collisions.SinkPlane = function ( particleAttributes, alive, delta_t, plane  ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;
    var players      = particleAttributes.player;
    var sizes        = particleAttributes.size;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );
        var player = getElement( i, players );

        var new_pos = intersectPlane(pos, vel, plane, delta_t);
        // collide with plane
        if (new_pos != undefined) {
            var platform = SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0];
            var platformPos = platform.mesh.position;
            if (player != platform.player) {
                platformPos = SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].mesh.position;
            }
            pos = new THREE.Vector3(platformPos.x, platformPos.y + 15, pos.z);
            vel = new THREE.Vector3(0, 0, 0);
            if (player == 1) {
                // subtract penalty from score
                if (SystemSettings.mySystem.player1_numBalls == 1) {
                    var score = parseInt(document.getElementById("score").innerHTML);
                    document.getElementById("score").innerHTML = score - SystemSettings.mySystem.basePenalty;
                }
                // no penalty for extra ball, just remove it
                else if (SystemSettings.mySystem.player1_numBalls > 1) {
                    console.log("player 1 - add ball powerup over");
                    SystemSettings.mySystem.player1_numBalls--;
                    pos = new THREE.Vector3(0, 0, 0);
                    setElement(i, sizes, 0);
                    setElement(i, players, -1);
                }
            }
            else if (player == 2) {
                // subtract penalty from score
                if (SystemSettings.mySystem.player2_numBalls == 1) {
                    var score = parseInt(document.getElementById("score_2").innerHTML);
                    document.getElementById("score_2").innerHTML = score - SystemSettings.mySystem.basePenalty;
                }
                // no penalty for extra ball, just remove it
                else if (SystemSettings.mySystem.player2_numBalls > 1) {
                    console.log("player 2 - add ball powerup over");
                    SystemSettings.mySystem.player2_numBalls--;
                    pos = new THREE.Vector3(0, 0, 0);
                    setElement(i, sizes, 0);
                    setElement(i, players, -1);
                }
            }
        }
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
    }
};

////////////////////////////////////////////////////////////////////////////////
// Null updater - does nothing
////////////////////////////////////////////////////////////////////////////////

function VoidUpdater ( opts ) {
    this._opts = opts;
    return this;
};

VoidUpdater.prototype.update = function ( particleAttributes, initialized, delta_t ) {
    //do nothing
};

////////////////////////////////////////////////////////////////////////////////
// Euler updater
////////////////////////////////////////////////////////////////////////////////

function EulerUpdater ( opts ) {
    this._opts = opts;
    return this;
};


EulerUpdater.prototype.updatePositions = function ( particleAttributes, alive, delta_t ) {
    var positions  = particleAttributes.position;
    var velocities = particleAttributes.velocity;

    for ( var i  = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        var p = getElement( i, positions );
        var v = getElement( i, velocities );
        p.add( v.clone().multiplyScalar( delta_t ) );
        setElement( i, positions, p );
    }
};

EulerUpdater.prototype.updateVelocities = function ( particleAttributes, alive, delta_t ) {
    var positions = particleAttributes.position;
    var velocities = particleAttributes.velocity;
    var gravity = this._opts.externalForces.gravity;
    var attractors = this._opts.externalForces.attractors;

    for ( var i = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        var p = getElement( i, positions );
        var v = getElement( i, velocities );

        // Update velocities based on gravity
        v.add(gravity.clone().multiplyScalar(delta_t));

        var G = 100;

        // Update velocites based on attractors
        for (var j = 0; j < attractors.length; j++) {
            var distance = p.distanceTo(attractors[j].center);

            // var mass = attractors[j].radius;
            var acceleration = G * attractors[j].radius / distance;
            var vectorTo = attractors[j].center.clone().sub(p).normalize();
            v.add(vectorTo.multiplyScalar(acceleration).multiplyScalar(delta_t));
        }

        setElement( i, velocities, v );
    }

};

EulerUpdater.prototype.updateColors = function ( particleAttributes, alive, delta_t ) {
    var colors    = particleAttributes.color;
    var positions = particleAttributes.position;

    var range = 50;
    var step = 0.1;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        var c = getElement( i, colors );
        var p = getElement( i, positions );

        if (applyRenderingEffects) {
            if (Math.round(p.length()) % range < range / 2)
                c = new THREE.Vector4(Math.max(0, c.x - step), Math.max(0, c.y - step), Math.max(0, c.z - step), 1);
            else
                c = new THREE.Vector4(Math.min(1, c.x + step), Math.min(1, c.y + step), Math.min(1, c.z + step), 1);
        }

        setElement( i, colors, c );
    }
};

EulerUpdater.prototype.updateSizes = function ( particleAttributes, alive, delta_t ) {
    var sizes    = particleAttributes.size;
    var positions = particleAttributes.position;

    var range = 50;
    var step = 0.1;

    for ( var i = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        var s = getElement( i, sizes );
        var p = getElement( i, positions );

        if (applyRenderingEffects) {
            if (Math.round(p.length()) % range < range / 2)
                s += step;
            else
                s -= step;
        }

        setElement( i, sizes, s );
    }

};

EulerUpdater.prototype.updateLifetimes = function ( particleAttributes, alive, delta_t) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;
    var players      = particleAttributes.player;
    var colors       = particleAttributes.color;
    var sizes        = particleAttributes.size;
    var lifetimes    = particleAttributes.lifetime;

    // count down timer
    SystemSettings.mySystem.currLifetime -= delta_t;

    // 2x points count down
    if (SystemSettings.mySystem.player1_cur2xPointsLifetime > 0) {
        SystemSettings.mySystem.player1_cur2xPointsLifetime -= delta_t;
        // remove 2x points text
        if (SystemSettings.mySystem.player1_cur2xPointsLifetime <= 0) {
            console.log("player 1 - 2x points powerup over");
            var score = parseInt(document.getElementById("score").innerHTML);
            document.getElementById("score").innerHTML = score;
        }
    }

    // 2x points count down
    if (SystemSettings.mySystem.player2_cur2xPointsLifetime > 0) {
        SystemSettings.mySystem.player2_cur2xPointsLifetime -= delta_t;
        // remove 2x points text
        if (SystemSettings.mySystem.player2_cur2xPointsLifetime <= 0) {
            console.log("player 2 - 2x points powerup over");
            var score = parseInt(document.getElementById("score_2").innerHTML);
            document.getElementById("score_2").innerHTML = score;
        }
    }

    // Wide platform count down
    if (SystemSettings.mySystem.player1_curWideLifetime > 0) {
        SystemSettings.mySystem.player1_curWideLifetime -= delta_t;
        
        // Put platform back to original width
        if (SystemSettings.mySystem.player1_curWideLifetime <= 0) {
            console.log("player 1 - wide platform powerup over");
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
            mesh.position.set(position.x, position.y, position.z);

            Scene.addObject(mesh);

            SystemSettings.mySystem.player1_platform = {
                geo: geo,
                mesh: mesh,
                material: material
            }

            SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].xMin = position.x - platformWidth / 2,
            SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].xMax = position.x + platformWidth / 2,
            SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].mesh = mesh;
        }
    }

    // wide platform count down
    if (SystemSettings.mySystem.player2_curWideLifetime > 0) {
        SystemSettings.mySystem.player2_curWideLifetime -= delta_t;

        // Put platform back to original width
        if (SystemSettings.mySystem.player2_curWideLifetime <= 0) {
            console.log("player 2 - wide platform powerup over");

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
            mesh.position.set(position.x, position.y, position.z);

            Scene.addObject(mesh);

            SystemSettings.mySystem.player2_platform = {
                geo: geo,
                mesh: mesh,
                material: material
            }

            SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].xMin = position.x - platformWidth / 2,
            SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].xMax = position.x + platformWidth / 2,
            SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].mesh = mesh;
        }
    }

    // freeze platform count down
    if (SystemSettings.mySystem.player1_curFreezeLifetime > 0) {
        SystemSettings.mySystem.player1_curFreezeLifetime -= delta_t;

        // set platform colour back to normal
        if (SystemSettings.mySystem.player1_curFreezeLifetime <= 0) {
            console.log("player 2 - freeze platform powerup over");
            var material = SystemSettings.mySystem.material_platformDefault1;
            var geo = SystemSettings.mySystem.player1_platform.geo;
            var dims = new THREE.Vector3(geo.parameters.width, geo.parameters.height, geo.parameters.depth);
            var mesh = SystemSettings.mySystem.player1_platform.mesh;
            var position = mesh.position.clone();

            Scene.removeObject(mesh);

            geo = new THREE.BoxGeometry(dims.x, dims.y, dims.z);
            mesh = new THREE.Mesh( geo, material);
            mesh.position.set(position.x, position.y, position.z);

            Scene.addObject(mesh);

            SystemSettings.mySystem.player1_platform = {
                geo: geo,
                mesh: mesh,
                material: material
            }

            SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[0].mesh = mesh;
        }
    }

    // freeze platform count down
    if (SystemSettings.mySystem.player2_curFreezeLifetime > 0) {
        SystemSettings.mySystem.player2_curFreezeLifetime -= delta_t;

        // set platform colour back to normal
        if (SystemSettings.mySystem.player2_curFreezeLifetime <= 0) {
            console.log("player 1 - freeze platform powerup over");
            var material = SystemSettings.mySystem.material_platformDefault2;
            var geo = SystemSettings.mySystem.player2_platform.geo;
            var dims = new THREE.Vector3(geo.parameters.width, geo.parameters.height, geo.parameters.depth);
            var mesh = SystemSettings.mySystem.player2_platform.mesh;
            var position = mesh.position.clone();

            Scene.removeObject(mesh);

            geo = new THREE.BoxGeometry(dims.x, dims.y, dims.z);
            mesh = new THREE.Mesh( geo, material);
            mesh.position.set(position.x, position.y, position.z);

            Scene.addObject(mesh);

            SystemSettings.mySystem.player2_platform = {
                geo: geo,
                mesh: mesh,
                material: material
            }

            SystemSettings.mySystem.updaterSettings.collidables.bouncePlatforms[1].mesh = mesh;
        }
    }

    // game over
    if (SystemSettings.mySystem.currLifetime < 0) {
        SystemSettings.mySystem.currLifetime = 0;
        SystemSettings.mySystem.isPlayGame = false;
        var winString = "PLAYER 1 WINS!";
        if (document.getElementById("score").innerHTML < document.getElementById("score_2").innerHTML) {
            winString = "PLAYER 2 WINS!";
        }
        else if (document.getElementById("score").innerHTML == document.getElementById("score_2").innerHTML) {
            winString = "TIE GAME!";
        }
        Gui.alertGameOver(winString);
    }
    document.getElementById("time").innerHTML = SystemSettings.mySystem.currLifetime.toFixed(3);
    document.getElementById("time_2").innerHTML = SystemSettings.mySystem.currLifetime.toFixed(3);
};

EulerUpdater.prototype.collisions = function ( particleAttributes, alive, delta_t ) {
    if ( !this._opts.collidables ) {
        return;
    }
    if ( this._opts.collidables.bouncePlanes ) {
        for (var i = 0 ; i < this._opts.collidables.bouncePlanes.length ; ++i ) {
            var plane = this._opts.collidables.bouncePlanes[i].plane;
            var damping = this._opts.collidables.bouncePlanes[i].damping;
            Collisions.BouncePlane( particleAttributes, alive, delta_t, plane, damping );
        }
    }

    if ( this._opts.collidables.sinkPlanes ) {
        for (var i = 0 ; i < this._opts.collidables.sinkPlanes.length ; ++i ) {
            var plane = this._opts.collidables.sinkPlanes[i].plane;
            Collisions.SinkPlane( particleAttributes, alive, delta_t, plane );
        }
    }

    if ( this._opts.collidables.bounceBoxes ) {
        for (var i = 0 ; i < this._opts.collidables.bounceBoxes.length ; ++i ) {
            var box = this._opts.collidables.bounceBoxes[i].box;
            var damping = this._opts.collidables.bounceBoxes[i].damping;
            Collisions.BounceBox( particleAttributes, alive, delta_t, box, damping );
        }
    }

    if ( this._opts.collidables.bouncePlatforms ) {
        for (var i = 0; i < this._opts.collidables.bouncePlatforms.length ; ++i ) {
            var platform = this._opts.collidables.bouncePlatforms[i];
            Collisions.BouncePlatform( particleAttributes, alive, delta_t, platform );
        }
    }
};

EulerUpdater.prototype.update = function ( particleAttributes, alive, delta_t ) {

    if (!SystemSettings.mySystem.isPlayGame) {
        return;
    }
    this.updateLifetimes( particleAttributes, alive, delta_t );
    this.updateVelocities( particleAttributes, alive, delta_t );
    this.updatePositions( particleAttributes, alive, delta_t );
    this.collisions( particleAttributes, alive, delta_t );
    this.updateColors( particleAttributes, alive, delta_t );
    this.updateSizes( particleAttributes, alive, delta_t );

    // tell webGL these were updated
    particleAttributes.position.needsUpdate = true;
    particleAttributes.color.needsUpdate = true;
    particleAttributes.velocity.needsUpdate = true;
    particleAttributes.lifetime.needsUpdate = true;
    particleAttributes.size.needsUpdate = true;
    particleAttributes.player.needsUpdate = true;

}
