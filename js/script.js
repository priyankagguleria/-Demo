var CDown = function () {
    this.state = 0;// if initialized
    this.counts = [];// array holding countdown date objects and id to print to {d:new Date(2013,11,18,18,54,36), id:"countbox1"}
    this.interval = null;// setInterval object
}

CDown.prototype = {
    init: function () {
        this.state = 1;
        var self = this;
        this.interval = window.setInterval(function () {
            self.tick();
        }, 1000);
    },
    add: function (date, id) {
        this.counts.push({d: date, id: id});
        this.tick();
        if (this.state == 0) this.init();
    },
    expire: function (idxs) {
        for (var x in idxs) {
            this.display(this.counts[idxs[x]], "Now!");
            this.counts.splice(idxs[x], 1);
        }
    },
    format: function (r) {
        var out = "<div>";
        out += "<div class='counter'>";
        out += "<div class='day number'>";
        out += r.d;
        out += "</div>";
        out += "<div class='countdownlabel'>";
        out += ((r.d == 1) ? "Day" : "Days")
        out += "</div>";
        out += "</div>";
        out += "<div class='counter'>";
        out += "<div class='hour number'>";
        out += r.h;
        out += "</div>";
        out += "<div class='countdownlabel'>";
        out += ((r.h == 1) ? "Hour" : "Hours")
        out += "</div>";
        out += "</div>";
        out += "<div class='counter'>";
        out += "<div class='min number'>";
        out += r.m;
        out += "</div>";
        out += "<div class='countdownlabel'>";
        out += ((r.m == 1) ? "Min" : "Minutes")
        out += "</div>";
        out += "</div>";
        out += "<div class='counter'>";
        out += "<div class='sec number'>";
        out += r.s;
        out += "</div>";
        out += "<div class='countdownlabel'>";
        out += ((r.S == 1) ? "Sec" : "Seconds")
        out += "</div>";
        out += "</div>";
        out += "</div>";
        return out.substr(0, out.length - 2);
    },
    math: function (work) {
        var y = w = d = h = m = s = ms = 0;

        ms = ("" + ((work % 1000) + 1000)).substr(1, 3);
        work = Math.floor(work / 1000);//kill the "milliseconds" so just secs

        y = Math.floor(work / 31536000);//years (no leapyear support)
        w = Math.floor(work / 604800);//weeks
        d = Math.floor(work / 86400);//days
        work = work % 86400;

        h = Math.floor(work / 3600);//hours
        work = work % 3600;

        m = Math.floor(work / 60);//minutes
        work = work % 60;

        s = Math.floor(work);//seconds

        return {y: y, w: w, d: d, h: h, m: m, s: s, ms: ms};
    },
    tick: function () {
        var now = (new Date()).getTime(),
            expired = [], cnt = 0, amount = 0;

        if (this.counts)
            for (var idx = 0, n = this.counts.length; idx < n; ++idx) {
                cnt = this.counts[idx];
                amount = cnt.d.getTime() - now;//calc milliseconds between dates

                // if time is already past
                if (amount < 0) {
                    expired.push(idx);
                }
                // date is still good
                else {
                    this.display(cnt, this.format(this.math(amount)));
                }
            }

        // deal with any expired
        if (expired.length > 0) this.expire(expired);

        // if no active counts, stop updating
        if (this.counts.length == 0) window.clearTimeout(this.interval);

    },
    display: function (cnt, msg) {
        document.getElementById(cnt.id).innerHTML = msg;
    }
};

window.onload = function () {
    var cdown = new CDown();

    var now = new Date();
    var oneHourAway = new Date(now.getTime() + 100*35000);

    cdown.add(new Date(oneHourAway), "timer_one");
    cdown.add(new Date(oneHourAway), "timer_two");
    cdown.add(new Date(oneHourAway), "timer_three");
	cdown.add(new Date(oneHourAway), "timer_new");
};