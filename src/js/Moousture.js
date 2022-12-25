var Moousture = new Class({});
Moousture.Directions = {
    East: 0,
    SouthEast: 1,
    South: 2,
    SouthWest: 3,
    West: 4,
    NorthWest: 5,
    North: 6,
    NorthEast: 7,
    E: 0,
    SE: 1,
    S: 2,
    SW: 3,
    W: 4,
    NW: 5,
    N: 6,
    NE: 7
};
Moousture.MouseProbe = new Class({
    Implements: [Options],
    options: {
        stopEvent: false
    },
    initialize: function(e, t) {
        var n = this;
        this.pos = {
            x: 0,
            y: 0
        };
        this.setOptions(t);
        var r = function(e) {
            n.pos = {
                x: e.pageX,
                y: e.pageY
            };
            n.onMove(e);
            if (n.options.stopEvent) e.stop();
            else e.stopPropagation()
        };
        $(e).mousemove(function(e) {
            if (n.down) r(e)
        }).mousedown(function(e) {
            this.pos = {
                x: e.pageX,
                y: e.pageY
            };
            n.down = true;
            n.onDown(e)
        }).mouseup(function(e) {
            this.pos = {
                x: e.pageX,
                y: e.pageY
            };
            n.onUp(e);
            n.down = false
        })
    }
});
Moousture.Monitor = new Class({
    initialize: function(e, t) {
        this.prev = {
            x: 0,
            y: 0
        };
        this.delay = $pick(e, 20);
        this.thresh = $pick(t, 1);
        this.wasStable = false
    },
    start: function(e, t) {
        if (this.timer) this.stop();
        this.prober = e;
        this.cbObject = t;
        var n = this;
        this.isIntervalSet = false;
        this.prevPos = {
            x: 0,
            y: 0
        };
        this.prober.onMove = function(e) {
            if (n.isIntervalSet) {
                return
            }
            n.timer = window.setInterval(function() {
                if (Math.pow(n.prober.pos.x - n.prevPos.x, 2) < 25 && Math.pow(n.prober.pos.y - n.prevPos.y, 2) < 25) return;
                n.cbObject.onMove(n.prober.pos);
                n.prevPos = n.prober.pos
            }, n.delay);
            n.isIntervalSet = true
        };
        this.prober.onUp = function(e) {
            n.isIntervalSet = false;
            window.clearTimeout(n.timer);
            n.timer = null;
            n.cbObject.onStable(n.prober.pos)
        };
        this.prober.onDown = function(e) {
            n.cbObject.onUnstable(n.prober.pos);
            n.prevPos = n.prober.pos
        }
    },
    stop: function() {
        $clear(this.timer);
        delete this.timer
    }
});
Moousture.Recorder = new Class({
    options: {
        matcher: null,
        maxSteps: 8,
        minSteps: 4
    },
    Implements: [Options, Events],
    initialize: function(e) {
        this.setOptions(e);
        this.options.matcher = e.matcher;
        this.movLog = []
    },
    onStable: function(e) {
        if (this.movLog.length < this.options.minSteps) {
            this.movLog.empty();
            return
        }
        if (this.options.matcher && this.options.matcher.match) this.options.matcher.match(this.movLog);
        this.fireEvent("complete", [this.movLog]);
        this.movLog.empty()
    },
    onUnstable: function(e) {
        this.movLog.empty();
        this.movLog.push(e);
        this.fireEvent("start")
    },
    onMove: function(e) {
        if (this.movLog.length > this.options.maxSteps) return;
        this.movLog.push(e)
    }
});
Moousture.GestureMatcher = new Class({
    mCallbacks: [],
    mGestures: [],
    initialize: function() {},
    angelize: function(e) {
        ret = [];
        for (i = 1; i < e.length - 1; i++) ret.push(this.getAngles(e[i], e[i + 1]));
        return ret
    },
    getAngles: function(e, t) {
        diffx = t.x - e.x;
        diffy = t.y - e.y;
        a = Math.atan2(diffy, diffx) + Math.PI / 8;
        if (a < 0) a = a + 2 * Math.PI;
        a = Math.floor(a / (2 * Math.PI) * 360) / 45;
        return Math.floor(a)
    },
    addGesture: function(e, t) {
        this.mCallbacks.push(t);
        this.mGestures.push(e)
    },
    match: function(e) {
        a = this.angelize(e);
        if (this.onMatch) this.onMatch(a)
    }
});
Moousture.LevenMatcher = new Class({
    Implements: [Moousture.GestureMatcher],
    onMatch: function(e) {
        cbLen = this.mCallbacks.length;
        if (cbLen < 1) return;
        minIndex = 0;
        console.log("move - " + e);
        minDist = this.levenDistance(e, this.mGestures[0]);
        console.log("dis - " + minDist);
        for (p = 1; p < cbLen; p++) {
            nwDist = this.levenDistance(e, this.mGestures[p]);
            if (nwDist < minDist) {
                minDist = nwDist;
                minIndex = p
            }
        }
        this.mCallbacks[minIndex](minDist / e.length)
    },
    levenDistance: function(e, t) {
        d = [];
        for (i = 0; i < e.length; i++) d[i] = [];
        if (e[0] != t[0]) d[0][0] = 1;
        else d[0][0] = 0;
        for (i = 1; i < e.length; i++) d[i][0] = d[i - 1][0] + 1;
        for (j = 1; j < t.length; j++) d[0][j] = d[0][j - 1] + 1;
        for (i = 1; i < e.length; i++) {
            for (j = 1; j < t.length; j++) {
                cost = 0;
                if (e[i] != t[j]) cost = 1;
                d[i][j] = d[i - 1][j] + 1;
                if (d[i][j] > d[i][j - 1] + 1) d[i][j] = d[i][j - 1] + 1;
                if (d[i][j] > d[i - 1][j - 1] + cost) d[i][j] = d[i - 1][j - 1] + cost
            }
        }
        return $pick(d[e.length - 1][t.length - 1], 0)
    }
});
Moousture.ReducedLevenMatcher = new Class({
    Implements: [Moousture.LevenMatcher],
    reduce: function(e) {
        ret = [];
        ret.push(e[0]);
        prev = e[0];
        for (i = 1; i < e.length; i++)
            if (prev != e[i]) {
                ret.push(e[i]);
                prev = e[i]
            } return ret
    },
    onMatch: function(e) {
        e = this.reduce(e);
        cbLen = this.mCallbacks.length;
        if (cbLen < 1 || !$defined(e[0])) return;
        minIndex = 0;
        console.log("move - " + e);
        minDist = this.levenDistance(e, this.mGestures[0]);
        console.log("dis - " + minDist);
        for (p = 1; p < cbLen; p++) {
            nwDist = this.levenDistance(e, this.mGestures[p]);
            if (nwDist < minDist) {
                minDist = nwDist;
                minIndex = p
            }
        }
        this.mCallbacks[minIndex](minDist / e.length)
    }
});
Moousture.TopedLevenMatcher = new Class({
    Implements: [Moousture.LevenMatcher],
    initialize: function(e) {
        this.topNumber = e
    },
    top: function(e) {
        self = this;
        var t = _.chain(e).reduce(function(e, t, n) {
            if (e.last == t) {
                re = e;
                _(re.seqs).last().count = _(re.seqs).last().count + 1;
                return re
            } else {
                re = e;
                re.seqs.push({
                    value: t,
                    count: 1,
                    first: n
                });
                re.last = t;
                return re
            }
        }, {
            seqs: [],
            last: -1
        }).value().seqs;
        var n = _.chain(t).sortBy(function(e) {
            return -e.count
        }).head(self.topNumber).value();
        var r = _.chain(t).filter(function(e) {
            return _(n).contains(e)
        }).pluck("value").value();
        return r
    },
    onMatch: function(e) {
        e = this.top(e);
        cbLen = this.mCallbacks.length;
        if (cbLen < 1 || !$defined(e[0])) return;
        minIndex = 0;
        console.log("move - " + e);
        minDist = this.levenDistance(e, this.mGestures[0]);
        console.log("dis - " + minDist);
        for (p = 1; p < cbLen; p++) {
            nwDist = this.levenDistance(e, this.mGestures[p]);
            if (nwDist < minDist) {
                minDist = nwDist;
                minIndex = p
            }
        }
        this.mCallbacks[minIndex](minDist / e.length)
    }
})