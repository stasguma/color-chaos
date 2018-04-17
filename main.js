(() => {
    let canvas = document.getElementById('canvas'),
        cnv = canvas.getContext('2d'),

        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        pi = Math.PI,
        pi2 = pi * 2,
        piD2 = pi / 2,
        tick = 0,
        Mouse = new Vector2(-w, -h),
        Colors = [
            "#2ecc71", "#3498db", "#e67e22", "#e74c3c", "#ecf0f1", "#9b59b6", "#2c3e50"
        ],
        options = {
            backgroungColor: "#222",
            showFPS: true,
            spacing: 30,
            size: 10,
            affRad: 130,
            speedLimit: 8
        },
        particles = [],
        Particle = function(X, Y) {
            this.pos = new Vector2(X, Y);
            this.speed = new Vector2();
            this.acc = new Vector2();
            this.color = Colors[Math.floor(Math.random() * Colors.length )];
        };

    Particle.prototype.update = function () {
        this.border();
        this.speed.add(this.acc);
        this.pos.add(this.speed);
        this.acc.set(0);

        return this;
    };
    Particle.prototype.border = function () {
        0 > this.pos.x ? (this.speed.x*=-1, this.pos.x = 0) : undefined;
		w < this.pos.x ? (this.speed.x*=-1, this.pos.x = w-options.size) : undefined;
		0 > this.pos.y ? (this.speed.y*=-1, this.pos.y = 0) : undefined;
		h < this.pos.y ? (this.speed.y*=-1, this.pos.y = h-options.size) : undefined;
    };
    Particle.prototype.render = function () {
        var size = options.size;

        cnv.fillStyle = this.color;
        cnv.beginPath();
        cnv.arc(this.pos.x, this.pos.y, size, 0, pi2);
        cnv.fill();

        return this;
    };
    Particle.prototype.force = function (f) {
        let target = f.copy();
        this.acc.add(target);

        return this;
    };
    Particle.prototype.runAway = function (t) {
        if (this.pos.distanceTo(t) < options.affRad) {
            let target = t.copy();
            target.sub(this.pos);
            target.mult(-1);
            let desired = target.sub(this.speed);
            target.limit(options.speedLimit);
            this.force(desired);
        }
        this.speed.limit(options.speedLimit);
        this.speed.div(1.06);

        return this;
    };


    function populate() {
        let spacing = options.spacing;
        particles = [];
        for (let x = spacing/2; x < w; x+=spacing) {
            for (let y = spacing/2; y < h; y+=spacing) {
                particles.push(new Particle(x, y));
            }
        }
    }

    function setup() {
        populate();

        window.requestAnimationFrame(loop);
    }

    function loop() {
        cnv.fillStyle = options.backgroungColor;
        cnv.fillRect(0, 0, w, h);
        particles.map(function(P) {
            P.runAway(Mouse).update().render();
        });


        window.requestAnimationFrame(loop);
    }

    setup();

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });
    window.addEventListener('mousemove', (event) => {
        Mouse.set(event.pageX, event.pageY);
    });
})();
