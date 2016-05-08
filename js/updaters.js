/*
 * In this file you can specify all sort of updaters
 *  We provide an example of simple updater that updates pixel positions based on initial velocity and gravity
 */

////////////////////////////////////////////////////////////////////////////////
// Collisions
////////////////////////////////////////////////////////////////////////////////

var applyRenderingEffects = false;
// var applyRenderingEffects = true;
var Collisions = Collisions || {};

Collisions.BouncePlatform = function(particleAttributes, alive, delta_t, platform) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    var normal_xy_min = new THREE.Vector3(0, 0, -1);
    var normal_xy_max = new THREE.Vector3(0, 0, 1);

    var normal_yz_min = new THREE.Vector3(-1, 0, 0);
    var normal_yz_max = new THREE.Vector3(1, 0, 0);

    var normal_xz_min = new THREE.Vector3(0, -1, 0);
    var normal_xz_max = new THREE.Vector3(0, 1, 0);

    var EPS = 0.1;

    for ( var i = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

        var newPos = pos.clone().add(vel.clone().multiplyScalar(delta_t));

        if (vel.dot(normal_xz_max) < 0) {
            if ((newPos.x >= platform.xMin && newPos.x <= platform.xMax && newPos.z >= platform.zMin && newPos.z <= platform.zMax) ||
                (pos.x >= platform.xMin && pos.x <= platform.xMax && pos.z >= platform.zMin && pos.z <= platform.zMax)) {
                var dist = Math.abs(platform.yMax - pos.y);
                var len = Math.abs(newPos.y - pos.y);
                if (len > dist) {

                    var distFromCenter = (pos.x - (platform.xMin + platform.xMax) / 2) / (platform.xMax - platform.xMin);
                    var newNormal = (new THREE.Vector3(1, 0, 0)).multiplyScalar(distFromCenter).add(normal_xz_max).normalize();
                    vel.reflect(newNormal);
                }
            }
        }

        setElement( i, positions, pos );
        setElement( i, velocities, vel );
    }
}

Collisions.SinkBox = function(particleAttributes, alive, delta_t, box) {
    var positions   = particleAttributes.position;

    // var normal_xmin = new THREE.Vector3(plane.x, plane.y, plane.z);

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );

        // Kill the particle if it's inside or on the box
        if (pos.x >= box.xMin && pos.x <= box.xMax && pos.y >= box.yMin && pos.y <= box.yMax && pos.z >= box.zMin && pos.z <= box.zMax) {
            killPartilce(i, particleAttributes, alive);
        }
        // ----------- STUDENT CODE END ------------
    }
}

Collisions.BounceBox = function(particleAttributes, alive, delta_t, box, damping) {
    if (!box.alive) {
        return;
    }

    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    var normal_xy_min = new THREE.Vector3(0, 0, -1);
    var normal_xy_max = new THREE.Vector3(0, 0, 1);

    var normal_yz_min = new THREE.Vector3(-1, 0, 0);
    var normal_yz_max = new THREE.Vector3(1, 0, 0);

    var normal_xz_min = new THREE.Vector3(0, -1, 0);
    var normal_xz_max = new THREE.Vector3(0, 1, 0);

    var EPS = 0.1;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

        if (pos.x >= box.xMin && pos.x <= box.xMax && pos.y >= box.yMin && pos.y <= box.yMax && pos.z >= box.zMin && pos.z <= box.zMax) {

            var closestPlaneNormal;
            var closestDistance = Number.POSITIVE_INFINITY;

            if (Math.abs(pos.x - box.xMin) < closestDistance) {
                closestPlaneNormal = normal_yz_min.clone();
                closestDistance = Math.abs(pos.x - box.xMin);
            }

            if (Math.abs(pos.x - box.xMax) < closestDistance) {
                closestPlaneNormal = normal_yz_max.clone();
                closestDistance = Math.abs(pos.x - box.xMax);
            }

            if (Math.abs(pos.y - box.yMin) < closestDistance) {
                closestPlaneNormal = normal_xz_min.clone();
                closestDistance = Math.abs(pos.y - box.yMin);
            }

            if (Math.abs(pos.y - box.yMin) < closestDistance) {
                closestPlaneNormal = normal_xz_max.clone();
                closestDistance = Math.abs(pos.y - box.yMin);
            }

            if (Math.abs(pos.z - box.zMin) < closestDistance) {
                closestPlaneNormal = normal_xy_min.clone();
                closestDistance = Math.abs(pos.z - box.zMin);
            }

            if (Math.abs(pos.z - box.zMin) < closestDistance) {
                closestPlaneNormal = normal_xy_max.clone();
                closestDistance = Math.abs(pos.z - box.zMin);
            }

            vel.reflect(closestPlaneNormal.clone()).multiplyScalar(damping);
            pos = pos.clone().sub(vel.clone().multiplyScalar(delta_t));
            // pos.add(closestPlaneNormal.clone().multiplyScalar(closestPlaneNormal.clone().dot(pos)));
            box.alive = false;
            Scene.removeObject(box.mesh);
        }

        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
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

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

        var new_pos = intersectPlane(pos, vel, plane, delta_t);
        // collide with plane, bounce off
        if (new_pos != undefined) {
            killPartilce(i, particleAttributes, alive);

            Gui.alertGameOver("GAME OVER");

        }

        setElement( i, positions, pos );
        setElement( i, velocities, vel );
    }
    // var positions   = particleAttributes.position;

    // var normal = new THREE.Vector3(plane.x, plane.y, plane.z);

    // for ( var i = 0 ; i < alive.length ; ++i ) {

    //     if ( !alive[i] ) continue;
    //     // ----------- STUDENT CODE BEGIN ------------
    //     var pos = getElement( i, positions );

    //     // Kill the particle if it's on the wrong side of the plane
    //     if (normal.dot(pos) < 0) {
    //         killPartilce(i, particleAttributes, alive);
    //     }
    //     // ----------- STUDENT CODE END ------------
    // }
};

Collisions.BounceSphere = function ( particleAttributes, alive, delta_t, sphere, damping ) {
    // meep();
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    var center = new THREE.Vector3(sphere.x, sphere.y, sphere.z);
    var radius = sphere.w;
    // radius *= 1.5;
    var EPS = 0.5;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

        var distance = pos.distanceTo(center);

        if (distance <= radius + EPS) {
            var normal = pos.clone().sub(center).normalize();
            pos.add(normal.clone().multiplyScalar(radius - distance + EPS));
            vel.reflect(normal).multiplyScalar(damping);
        }

        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
}

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
        // ----------- STUDENT CODE BEGIN ------------
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
        // ----------- STUDENT CODE END ------------
    }

};

EulerUpdater.prototype.updateColors = function ( particleAttributes, alive, delta_t ) {
    var colors    = particleAttributes.color;
    var positions = particleAttributes.position;

    var range = 50;
    var step = 0.1;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var c = getElement( i, colors );
        var p = getElement( i, positions );

        if (applyRenderingEffects) {
            if (Math.round(p.length()) % range < range / 2)
                c = new THREE.Vector4(Math.max(0, c.x - step), Math.max(0, c.y - step), Math.max(0, c.z - step), 1);
            else
                c = new THREE.Vector4(Math.min(1, c.x + step), Math.min(1, c.y + step), Math.min(1, c.z + step), 1);
        }

        setElement( i, colors, c );
        // ----------- STUDENT CODE END ------------
    }
};

EulerUpdater.prototype.updateSizes = function ( particleAttributes, alive, delta_t ) {
    var sizes    = particleAttributes.size;
    var positions = particleAttributes.position;

    var range = 50;
    var step = 0.1;

    for ( var i = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var s = getElement( i, sizes );
        var p = getElement( i, positions );

        if (applyRenderingEffects) {
            if (Math.round(p.length()) % range < range / 2)
                s += step;
            else
                s -= step;
        }

        setElement( i, sizes, s );
        // ----------- STUDENT CODE END ------------
    }

};

EulerUpdater.prototype.updateLifetimes = function ( particleAttributes, alive, delta_t) {
    var positions     = particleAttributes.position;
    var lifetimes     = particleAttributes.lifetime;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;

        var lifetime = getElement( i, lifetimes );

        if ( lifetime < 0 ) {
            killPartilce( i, particleAttributes, alive );
        } else {
            setElement( i, lifetimes, lifetime - delta_t );
        }
    }

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

    if ( this._opts.collidables.spheres ) {
        for (var i = 0 ; i < this._opts.collidables.spheres.length ; ++i ) {
            Collisions.Sphere( particleAttributes, alive, delta_t, this._opts.collidables.spheres[i] );
        }
    }

    if ( this._opts.collidables.bounceSpheres ) {
        for (var i = 0 ; i < this._opts.collidables.bounceSpheres.length ; ++i ) {
            var sphere = this._opts.collidables.bounceSpheres[i].sphere;
            var damping = this._opts.collidables.bounceSpheres[i].damping;
            Collisions.BounceSphere( particleAttributes, alive, delta_t, sphere, damping );
        }
    }

    if ( this._opts.collidables.sinkBoxes ) {
        for (var i = 0 ; i < this._opts.collidables.sinkBoxes.length ; ++i ) {
            var box = this._opts.collidables.sinkBoxes[i];
            Collisions.SinkBox( particleAttributes, alive, delta_t, box );
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
        // for (var i = 0 ; i < this._opts.collidables.bounceBoxes.length ; ++i ) {
        //     var box = this._opts.collidables.bounceBoxes[i].box;
        //     var damping = this._opts.collidables.bounceBoxes[i].damping;
        //     Collisions.BounceBox( particleAttributes, alive, delta_t, box, damping );
        // }
    }
};

EulerUpdater.prototype.update = function ( particleAttributes, alive, delta_t ) {

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

}


function ClothUpdater ( opts ) {
    this._opts = opts;
    this._s = 10.0;
    this._k_s = 0.55;
    return this;
}

ClothUpdater.prototype.calcHooke = function ( p, q ) {
    // ----------- STUDENT CODE BEGIN ------------
    // var k_s = this._k_s;
    var k_s = 30;
    var rest_len = this._s;

    var D = q.clone().sub(p).normalize();
    var d = q.clone().sub(p).length();

    return D.multiplyScalar(k_s * (d - rest_len));
    // ----------- STUDENT CODE END ------------
}

ClothUpdater.prototype.updatePositions = function ( particleAttributes, alive, delta_t ) {
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

ClothUpdater.prototype.updateVelocities = function ( particleAttributes, alive, delta_t, width, height ) {
    var positions = particleAttributes.position;
    var velocities = particleAttributes.velocity;
    var gravity = this._opts.externalForces.gravity;
    var attractors = this._opts.externalForces.attractors;
    var mass = 1;

    for ( var j = 0 ; j < height; ++j ) {
        for ( var i = 0 ; i < width ; ++i ) {
            var idx = j * width + i;

            // ----------- STUDENT CODE BEGIN ------------
            var p = getElement( idx, positions );
            var v = getElement( idx, velocities );

            // Update velocities based on gravity
            v.add(gravity.clone().multiplyScalar(delta_t));

            // Calculate forces on this node from neighboring springs
            var neighbourIdx = [];
            var newJ, newI;

            // Find neighbour indices
            newJ = j - 1;
            newI = i;
            if (newJ >= 0) {
                neighbourIdx.push(newJ * width + newI);
            }

            newJ = j + 1;
            newI = i;
            if (newJ < height) {
                neighbourIdx.push(newJ * width + newI);
            }

            newJ = j;
            newI = i - 1;
            if (newI >= 0) {
                neighbourIdx.push(newJ * width + newI);
            }

            newJ = j;
            newI = i + 1;
            if (newI < width) {
                neighbourIdx.push(newJ * width + newI);
            }

            // Add contribution from spring force from each neighbour
            for (var k = 0; k < neighbourIdx.length; k++) {
                if (neighbourIdx[k] >= 0 && neighbourIdx[k] < positions.length) {
                    neighbourPos = getElement(neighbourIdx[k], positions);
                    var f = this.calcHooke(p, neighbourPos);
                    v.add(f.clone().divideScalar(mass).multiplyScalar(delta_t));
                }
            }

            setElement( idx, velocities, v );
            // ----------- STUDENT CODE END ------------
        }
    }

};


ClothUpdater.prototype.collisions = function ( particleAttributes, alive, delta_t ) {
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

    if ( this._opts.collidables.bounceSpheres ) {
        for (var i = 0 ; i < this._opts.collidables.bounceSpheres.length ; ++i ) {
            var sphere = this._opts.collidables.bounceSpheres[i].sphere;
            var damping = this._opts.collidables.bounceSpheres[i].damping;
            Collisions.BounceSphere( particleAttributes, alive, delta_t, sphere, damping );
        }
    }
};


ClothUpdater.prototype.update = function ( particleAttributes, alive, delta_t, width, height ) {

    this.updateVelocities( particleAttributes, alive, delta_t, width, height );
    this.updatePositions( particleAttributes, alive, delta_t, width, height );

    this.collisions( particleAttributes, alive, delta_t );

    // tell webGL these were updated
    particleAttributes.position.needsUpdate = true;
    particleAttributes.color.needsUpdate = true;
    particleAttributes.velocity.needsUpdate = true;
    particleAttributes.lifetime.needsUpdate = true;
    particleAttributes.size.needsUpdate = true;
}
