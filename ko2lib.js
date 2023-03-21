// Copyright (C) 2023 ko2 All right Reserved.

ko2js = {};

// classes
ko2js.classes = { };

// render base
ko2js.classes.Render = class {
    constructor() { }
    tag() { }
    reszize(w, h) { }
    viewport(x, y, w, h) { }
    draw_line(x1, y1, x2, y2, spec) { }
    draw_rectangle(x, y, w, h, spec)  { }
    draw_circle(x, y, r, spec) { }
    draw_string(str, x, y, spec) { }
    transform(p) { return {x: p.x, y: p.y}; }
    animate(config) {}
};

// canvas
ko2js.classes.RenderCanvas = class extends ko2js.classes.Render {
    constructor() {
        super();
    }
};

// svg
ko2js.classes.RenderSVG = class extends ko2js.classes.Render {
    constructor() {
        super();

        this._svg = this.create_element("svg");
        //this._svg.style.background = "skyblue";

        let marker = this.create_element("marker");
        marker.id = "arrow1";
        marker.setAttributeNS(null, "markerWidth", "20");
        marker.setAttributeNS(null, "markerHeight", "10");
        marker.setAttributeNS(null, "refX", "10");
        marker.setAttributeNS(null, "refY", "5");
        marker.innerHTML = "<polygon points='0,0 10,5 0,10' stroke='black' />";
        marker.setAttributeNS(null, "orient", "auto");
        this._svg.appendChild(marker);

        marker = this.create_element("marker");
        marker.id = "arrow2";
        marker.setAttributeNS(null, "markerWidth", "20");
        marker.setAttributeNS(null, "markerHeight", "10");
        marker.setAttributeNS(null, "refX", "10");
        marker.setAttributeNS(null, "refY", "5");
        marker.innerHTML = "<line x1=0 y1=0 x2=10 y2=5 stroke='black' />"
            + "<line x1=10 y1=5 x2=0 y2=10 stroke='black' />";
        marker.setAttributeNS(null, "orient", "auto");
        this._svg.appendChild(marker);

        this._g = this.create_element("g");
        this._svg.appendChild(this._g);
    }

    create_element(type) {
        return document.createElementNS("http://www.w3.org/2000/svg", type);
    }

    tag() {
        return this._svg;
    }

    resize(w, h) {
        this._w = w;
        this._h = h;

        this._svg.setAttributeNS(null, "width", this._w);
        this._svg.setAttributeNS(null, "height", this._h);
    }

    viewport(x, y, w, h) {
        this._vx = x;
        this._vy = y;
        this._vw = w;
        this._vh = h;
        let value = x + " " + y + " " + w + " " + h;
        this._svg.setAttributeNS(null, "height", value);
    }

    get_value(spec, name, defvalue) {
        if (typeof(spec) == "undefined") {
            return defvalue;
        }

        if (typeof(spec[name]) != "undefined") {
            return spec[name];
        } else {
            return defvalue;
        }
    }

    draw_line(x1, y1, x2, y2, spec) {
        let obj = this.create_element("line");
        this._g.appendChild(obj);
        obj.setAttributeNS(null, "x1", x1);
        obj.setAttributeNS(null, "y1", y1);
        obj.setAttributeNS(null, "x2", x2);
        obj.setAttributeNS(null, "y2", y2);
        obj.setAttributeNS(null, "stroke", this.get_value(spec, "stroke", "black"));
        if (typeof(spec.markerEnd) != "undefined") {
            obj.setAttributeNS(null, "marker-end", "url(#" + spec.markerEnd + ")");
        }
        if (typeof(spec.dash) != "undefined") {
            obj.setAttributeNS(null, "stroke-dasharray", this.get_value(spec, "dash", "4"));
        }
        this._svg.appendChild(obj);
        return obj;
    }

    draw_rectangle(x, y, w, h, spec) {
        let obj = this.create_element("rect");
        this._g.appendChild(obj);
        obj.setAttributeNS(null, "x", x);
        obj.setAttributeNS(null, "y", y);
        obj.setAttributeNS(null, "width", w);
        obj.setAttributeNS(null, "height", h);
        obj.setAttributeNS(null, "stroke", this.get_value(spec, "stroke", "black"));
        obj.setAttributeNS(null, "fill", this.get_value(spec, "fill", "none"));
        this._svg.appendChild(obj);
        return obj;
    }

    draw_circle(x, y, r, spec) {
        let obj = this.create_element("ellipse");
        this._g.appendChild(obj);
        obj.setAttributeNS(null, "cx", x);
        obj.setAttributeNS(null, "cy", y);
        obj.setAttributeNS(null, "rx", r);
        obj.setAttributeNS(null, "rt", r);
        obj.setAttributeNS(null, "stroke", this.get_value(spec, "stroke", "black"));
        obj.setAttributeNS(null, "fill", this.get_value(spec, "fill", "none"));
        this._svg.appendChild(obj);
        return obj;
    }

    draw_string(str, x, y, spec) {
        let obj = this.create_element("text");
        this._g.appendChild(obj);
        obj.setAttributeNS(null, "x", x);
        obj.setAttributeNS(null, "y", y);
        obj.innerHTML = str;
        obj.setAttributeNS(null, "stroke", this.get_value(spec, "stroke", "none"));
        obj.setAttributeNS(null, "fill", this.get_value(spec, "fill", "black"));
        obj.setAttributeNS(null, "font-family", this.get_value(spec, "font.family", "Consolas"));
        obj.setAttributeNS(null, "font-size", this.get_value(spec, "font.size", "0.8em"));
        if ((typeof(spec) != "undefined") && (typeof(spec.anchor) != "undefined")) {
            let halign = "middle";
            //let valign = "middle";
            switch(spec.anchor) {
                case "e": halign = "end"; break;
                case "w": halign = "start"; break;
                case "m": halign = "middle"; break;
            }
            obj.setAttributeNS(null, "text-anchor", halign);
            //obj.setAttributeNS(null, "dominant-baseline", valign);
        }
        this._svg.appendChild(obj);
        return obj;
    }

    transform(org) {
        let svg = this._svg;
        let svg_point = svg.createSVGPoint();
        svg_point.x = org.x;
        svg_point.y = org.y;
        let transformed = svg_point.matrixTransform(svg.getScreenCTM().inverse());
        return transformed;

        /*
        let svg = this._canvas.tag();
        let svgP;
        let pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        console.log(this._cx+","+this._cy+"=>"+svgP.x+","+svgP.y);
        */
    }

    animate(config) {
        let anime = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        anime.setAttributeNS(null, "attributeName", config.name);
        anime.setAttributeNS(null, "to", config.to);
        anime.setAttributeNS(null, "dur", config.duration);
        anime.setAttributeNS(null, "begin", "0s");
        anime.setAttributeNS(null, "fill", "freeze");
        return anime;
    }
};

// general canvas
ko2js.classes.Canvas = class {
    constructor(type) {
        this._renderer = null;
        switch(type) {
            case "canvas":
                this._renderer = new ko2js.classes.RenderCanvas();
                break;
            case "svg":
                this._renderer = new ko2js.classes.RenderSVG();
                break; 
            default:
                throw new Error(type + ": unknown type.");
        }
    }

    draw_line(x1, y1, x2, y2, spec) {
        return this._renderer.draw_line(x1, y1, x2, y2, spec);
    }

    draw_rectangle(x1, y1, x2, y2, spec) {
        return this._renderer.draw_rectangle(x1, y1, x2, y2, spec);
    }

    draw_circle(x, y, r, spec) {
        return this._renderer.draw_circle(x, y, r, spec);
    }

    draw_string(str, x, y, spec) {
        return this._renderer.draw_string(str, x, y, spec);
    }

    tag() {
        return this._renderer.tag();
    }

    resize(w, h) {
        this._renderer.resize(w, h);
    }

    viewport(x, y, w, h) {
        this._renderer.viewport(x, y, w, h);
    }

    transform(p) {
        return this._renderer.transform(p);
    }

    animate(config) {
        return this._renderer.animate(config);
    }
};

// toc
ko2js.toc = {};
ko2js.toc.view = function(toc) {
    let elist = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
    let idx = "";
    for(let i=0; i<elist.length; i++) {
        if (elist[i].className == "toc_ignore") {
            continue;
        }
        let name = "t" + i;
        let style = "i" + i;
        switch(elist[i].tagName) {
            case "H1": style = "i1"; break;
            case "H2": style = "i2"; break;
            case "H3": style = "i3"; break;
            case "H4": style = "i4"; break;
            case "H5": style = "i5"; break;
            case "H6": style = "i6"; break;
        }
        let text = elist[i].innerText;
        idx += "<div class='"+style+"'><a href='#"+name+"'>"+text+"</a></div>";
        elist[i].innerHTML = "<a name='"+name+"'>"+text+"</a>";
    }
    toc.innerHTML = idx;
};

// code
ko2js.code = {
    view: function() {
        let elist = document.getElementsByClassName("codeview");
        let n = elist.length;
        for(let i=0; i<n; i++) {
            let script = elist[i];
            let lines = script.innerText.split("\n");
            let start_string = -1;
            let text = "<pre class='codeview'>";
            for(let j=0; j<lines.length; j++) {
                if (lines[j].length == 0) {
                    text += "<br>";
                } else {
                    if (start_string == (-1)) {
                        for(let k=0; k<lines[j].length; k++) {
                            if (lines[j][k] != ' ') {
                                start_string = k;
                                break;
                            }
                        }
                    }
                    let line = lines[j].substring(start_string);
                    text += ko2js.code.format_cxx(line) + "<br>";
                }
            }
            text += "</pre>";
            script.insertAdjacentHTML('beforebegin', text);
        }
    },
    format_cxx: function(text) {
        text = text.replaceAll("<", "&lt;");
        text = text.replaceAll(">", "&gt;");
        text = text.replaceAll(/(\#define)/g, "<span class=keyword01>$1</span>");
        text = text.replaceAll(/(\#include)/g, "<span class=keyword01>$1</span>");
        return text;
    }
};

// data
ko2js.classes.Graph = class {
    constructor(render) {
        this._render = render;
        this._background = "#aaa";
        this._xpad = 10;
        this._ypad = 10;

        this.xrange(0, 1);
        this.yrange(0, 1);
    }

    locate(x, y, w, h) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;

        this._x1 = x + this._xpad;
        this._x2 = x + w - 1 - this._xpad;
        this._y1 = y + this._ypad;
        this._y2 = y + h - 1 - this._ypad;

        this._gx1 = this._x1 + 100;
        this._gy1 = this._y1 + 20;
        this._gx2 = this._x2 - 20;
        this._gy2 = this._y2 - 40;
        this._gdx = this._gx2 - this._gx1;
        this._gdy = this._gy2 - this._gy1;

        this._render.resize(this._w, this._h);
    }

    autoscale(d) {
        let digit = Math.floor(Math.log10(d));
        let base = Math.floor(d / Math.pow(10, digit));
        return {digit: digit, base: base}
    }

    xrange(min, max, autoscale) {
        let xmin = min;
        let xmax = max;
        if ((typeof(autoscale) != "undefined") && (autoscale == 1)) {
            let value = this.autoscale(min);
            xmin = (value.base - 1) * Math.pow(10, value.digit);
            value = this.autoscale(max);
            xmax = (value.base + 1) * Math.pow(10, value.digit);
        }
        this._xmin = xmin;
        this._xmax = xmax;
        this._pdx = xmax - xmin;
        this._xinc = this._pdx / 10.0;
    }

    yrange(min, max, autoscale) {
        let ymin = min;
        let ymax = max;
        if ((typeof(autoscale) != "undefined") && (autoscale == 1)) {
            let value = this.autoscale(min);
            ymin = (value.base - 1) * Math.pow(10, value.digit);
            value = this.autoscale(max);
            ymax = (value.base + 1) * Math.pow(10, value.digit);
        }
        this._ymin = ymin;
        this._ymax = ymax;
        this._pdy = ymax - ymin;
        this._yinc = this._pdy / 10.0;
    }

    px2gx(px) {
        return this._gx1 + ((px - this._xmin) * this._gdx) / this._pdx;
    }

    py2gy(py) {
        return this._gy2 - ((py - this._ymin) * this._gdy) / this._pdy;
    }

    clear_area() {
        let x = this._x1;
        let y = this._y1;
        let w = this._x2 - this._x1 + 1;
        let h = this._y2 - this._y1 + 1;
        this._render.draw_rectangle(x, y, w, h, {fill: this._background, stroke: "none"});
    }

    round_value(d) {
        if (d == 0) {
            return 0;
        }
        let digit = Math.floor(Math.log10(d));
        let base = Math.round(d / Math.pow(10, digit));
        let round = base * Math.pow(10, digit);
        round = Math.round(round * 100) / 100; 
        return round;
    }

    draw_axis_x() {
        this._render.draw_line(this._gx1, this._gy2, this._gx2, this._gy2, {stroke: "black"});
        let i = 0;
        for(let x=this._xmin; x<this._xmax; x+=this._xinc) {
            let gx = this.px2gx(x);
            let gy = this._gy2;
            this._render.draw_line(gx, gy, gx, gy+10, {stroke: "black"});
            if (!(i & 0x1)) {
                this._render.draw_string(this.round_value(x).toString(), gx, gy+20, {anchor: "m"});
            }
            i++;
        }
    }

    draw_axis_y() {
        this._render.draw_line(this._gx1, this._gy1, this._gx1, this._gy2, {stroke: "black"});
        let i = 0;
        for(let y=this._ymin; y<this._ymax; y+=this._yinc) {
            let gx = this._gx1;
            let gy = this.py2gy(y);
            this._render.draw_line(gx-10, gy, gx, gy, {stroke: "black"});
            if (!(i & 0x1)) {
                this._render.draw_string(this.round_value(y).toString(), gx-20, gy, {anchor: "e"});
            }
            i++;
        }
    }

    draw_axis() {
        this.draw_axis_x();
        this.draw_axis_y();
    }

    draw() {
        this.clear_area();
        this.draw_axis();
    }

};

// diagram
ko2js.diagram = {
    classes : {
        Sequence : class {
            constructor() {
                this._canvas = new ko2js.classes.Canvas("svg");
                this._seqs = [];
                this._names = [];
                this._config = {
                    boxW: 120,
                    boxH: 40,
                    padding: 10,
                };
                this._size = {
                    w: 0,
                    h: 0,
                }
            }

            nameid(name) {
                // already known.
                for(let i=0; i<this._names.length; i++) {
                    if (name == this._names[i]) {
                        return i;
                    }
                }
                // new name
                this._names.push(name);
                return this._names.length - 1;
            }

            add(seq) {
                seq.srcid = this.nameid(seq.src); // register src
                seq.desid = this.nameid(seq.des); // register des
                this._seqs.push(seq); 
            }

            reconfigure() {
                let ncols = this._names.length;
                let nrows = this._seqs.length;
                let w = this._config.boxW;
                let h = this._config.boxH;
                let padding = this._config.padding;
                this._size.w = ncols * (w + padding * 2);
                this._size.h = nrows * (h + padding * 2);
                this._canvas.resize(this._size.w, this._size.h);
                //console.log(this._size);
            }

            draw() {
                this.reconfigure();

                // draw actors
                let uw = this._config.boxW + this._config.padding;
                let uh = this._config.boxH + this._config.padding;
                let px = this._config.padding >> 1;
                let py = this._config.padding >> 1;
                for(let i=0; i<this._names.length; i++) {
                    let bx = i * uw + px;
                    let by = py;
                    this._canvas.draw_rectangle(bx, by, this._config.boxW, this._config.boxH, { stroke: "black", fill: "none" });
                    this._canvas.draw_string(this._names[i], bx+5, by+25, {fill: "black", stroke: "none"});
                }

                // draw life line
                let hW = uw >> 1;
                let by1 = py + this._config.boxH;
                let by2 = this._size.h - this._config.padding;
                for(let i=0; i<this._names.length; i++) {
                    let bx = px + i * uw + hW;
                    this._canvas.draw_line(bx, by1, bx, by2, {stoke: "black"});
                }

                // sequence line
                let sy = this._config.boxH + this._config.padding * 3;
                for(let i=0; i<this._seqs.length; i++) {
                    let seq = this._seqs[i];
                    let x1 = px + uw * seq.srcid + hW;
                    let x2 = px + uw * seq.desid + hW;
                    //console.log(x1 + " - " + x2);
                    switch(this._seqs[i].atype) {
                        case 1:
                            this._canvas.draw_line(x1, sy, x2, sy, {stroke: "black", markerEnd: "#arrow1"});
                             break;
                        
                        case 2:
                            this._canvas.draw_line(x1, sy, x2, sy, {stroke: "black", markerEnd: "#arrow2"});
                            break;

                        case 3:
                            this._canvas.draw_line(x1, sy, x2, sy, {stroke: "black", markerEnd: "#arrow2", dash: "4"});
                            break;
                    }

                    if (seq.message != null) {
                        let xmax = Math.max(x1, x2);
                        this._canvas.draw_string(seq.message, xmax + 5, sy);
                    }

                    sy += this._config.boxH;
                }
            }

            tag() {
                //console.log(this._canvas.tag());
                return this._canvas.tag();
            }
        },
        SequenceLine : class {
            constructor(src, des, atype, param) {
                this._src = src;
                this._des = des;
                this._srcid = 0;
                this._desid = 0;
                this._atype = atype;
                this._message = null;
                this._time = null;
                this._seqid = null;
                this._seqno = null;
            }

            get src() { return this._src; }
            get des() { return this._des; }
            get srcid() { return this._srcid; }
            get desid() { return this._desid; }
            get atype() { return this._atype; }
            get message() { return this._message; }
            get time() { return this._time; }
            get seqid() { return this._seqid; }
            get seqno() { return this._seqno; }


            set srcid(value) { this._srcid = value; }
            set desid(value) { this._desid = value; }
            set message(value) { this._message = value; }
            set time(value) { this._time = value; }
            set seqid(value) { this._seqid = value; }
            set seqno(value) { this._seqno = value; }
        },
        ScatterPlot: class extends ko2js.classes.Graph {
            constructor(canvas) {
                super(canvas);
                this._data = null;
            }

            add(data) {
                this._data = data;
            }

            draw() {
                console.log("draw");

                if (this._data == null) {
                    super.draw(); // draw only axis.
                    return;
                }

                let xlist = [];
                let ylist = [];
                for(let i=0; i<this._data.length; i++) {
                    xlist.push(this._data[i][0]);
                    ylist.push(this._data[i][1]);
                }
                this.xrange(Math.min(...xlist), Math.max(...xlist), true);
                this.yrange(Math.min(...ylist), Math.max(...ylist), true);

                super.draw();

                for(let i=0; i<this._data.length; i++) {
                    let gx = this.px2gx(xlist[i]);
                    let gy = this.py2gy(ylist[i]);
                    this._render.draw_circle(gx, gy, 4, {fill: "orange"});
                }
            }
        },
        Histogram: class extends ko2js.classes.Graph {
            constructor(canvas) {
                super(canvas);
            }
        },
    },
    sequence: {
        atype_id: function(arrow_str) {
            switch(arrow_str) {
                case "->>": case "<<-": return 1;
                case "-->": case "<--": return 2;
                case "..>": case "<..": return 3;
            }
        },
        create_line: function(raw_line) {
            let line = raw_line.trim();
            let items = line.split(" ");
            if (items.length == 0) {
                return;
            }

            let param = { src: null, des: null, atype: 0 };
            switch(items[1]) {
                // synchronization
                case "->>": param = { src: 0, des: 2, atype: 1 }; break;
                case "<<-": param = { src: 2, des: 0, atype: 1 }; break;
                // asynchorization
                case "-->": param = { src: 0, des: 2, atype: 2 }; break;
                case "<--": param = { src: 2, des: 0, atype: 2 }; break;
                // return value
                case "..>": param = { src: 0, des: 2, atype: 3 }; break;
                case "<..": param = { src: 2, des: 0, atype: 3 }; break;
                // unknown
                default:
                    return null;
            }
            let seqline = new ko2js.diagram.classes.SequenceLine(
                items[param.src], items[param.des], ko2js.diagram.sequence.atype_id(items[1])
            );
            
            if (items.length > 3) {
                if (items[3] == ':') {
                    let pos1 = line.indexOf(':') + 1;
                    let pos2 = line.indexOf("[");
                    let message = null;
                    if (pos2 == (-1)) {
                        message = line.substring(pos1);
                    } else {
                        message = line.substring(pos1, pos2 - 1);
                    }
                    seqline.message = message;
                }
            }

            return seqline;
        },
        config: {
        },
        viewByClassName: function() {
            let elist = document.getElementsByClassName("sequence");
            let n = elist.length;
            for(let i=0; i<n; i++) {
                let script = elist[i];
                let lines = script.innerText.split("\n");
                let diagram = new ko2js.diagram.classes.Sequence("svg");
                for(let j=0; j<lines.length; j++) {
                    let seqline = ko2js.diagram.sequence.create_line(lines[j]);
                    if (seqline != null) {
                        diagram.add(seqline);
                    }
                }
                diagram.draw();

                let tag = diagram.tag();
                document.body.insertBefore(tag, script);
            }
        },
        view: function(frame, seqlist) {
            //console.log("view");
            let diagram = new ko2js.diagram.classes.Sequence("svg");
            for(let i=0; i<seqlist.length; i++) {
                let seq = seqlist[i];
                let seqline = new ko2js.diagram.classes.SequenceLine(
                    seq.src, seq.des, ko2js.diagram.sequence.atype_id(seq.atype)
                );
                if (typeof(seq.message) != "undefined") {
                    seqline.message = seq.message;
                }
                diagram.add(seqline);
            }
            diagram.draw();
            let tag = diagram.tag();
            document.getElementById(frame).appendChild(tag);
        }
    },
    graph: {
        create: function(ename, spec) {
            let screen = document.getElementById(ename); // tagName
            let canvas = null;
            switch(spec.render) {
                case "svg":
                    canvas = new ko2js.classes.Canvas("svg");
                    break;
            }
            let graph = new ko2js.diagram.classes.ScatterPlot(canvas);
            graph.locate(0, 0, screen.clientWidth, screen.clientHeight);
            screen.appendChild(canvas.tag());
            return graph;
        }
    }
};

//
ko2js.wsys = {
    classes: {
        Win: class {
            constructor(wm) {
                this._wm = wm;
                this._x = 0;
                this._y = 0;
                this._w = 0;
                this._h = 0;
                this._name = "";
            }
            set x(value) { this._x = value; }
            set y(value) { this._y = value; }
            set w(value) { this._w = value; }
            set h(value) { this._h = value; }
            get x() { return this._x; }
            get y() { return this._y; }
            get w() { return this._w; }
            get h() { return this._h; }
            set name(value) { this._name = value }
            get name() { return this._name; }
            hit(x, y) {
                if ((x >= this._x) && (x < (this._x + this._w)) && (y >= this._y) && (y < (this._y + this._h))) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        Layout: class {

        },
        WinMgr : class {
            constructor(ename) {
                this._screen = document.getElementById(ename);
                switch(this._screen.tagName) {
                    case "SVG":
                        break;

                    case "CANVAS":
                        break;

                    case "DIV":
                        break;
                }
            }
        }
    },
    winmgr : {
        create: function(ename) {

        }
    }
};

// gui
ko2js.gui = {
    classes: {
        Joystick: class {
            constructor(canvas, param) {
                this._canvas = canvas;
                this._cx = param.cx;
                this._cy = param.cy;
                this._r = param.r;
                this._background = param.background;
                this._x = 0;
                this._y = 0;

                this._animations = [];

                this.draw();

                console.log(canvas);

                let tag = this._canvas.tag();
                //tag.style.background = "#eee";
                tag.addEventListener("mousedown", (function(obj) {
                    return function(e) {
                        obj.mousedown(e);
                    };
                })(this));
                tag.addEventListener("mousemove", (function(obj) {
                    return function(e) {
                        obj.mousemove(e);
                    };
                })(this));
                tag.addEventListener("mouseup", (function(obj) {
                    return function(e) {
                        obj.mouseup(e);
                    };
                })(this));

                this._dragging = false;
            }

            mousedown(e) {
                let mpoint = this._canvas.transform({x: e.clientX, y: e.clientY});

                let dx = mpoint.x - this._cx;
                let dy = mpoint.y - this._cy;
                let d = Math.sqrt((dx*dx) + (dy*dy));
                if (d >= this._r) {
                    return;
                }

                this._dragging = true;
                this._px = mpoint.x;
                this._py = mpoint.y;
            }

            mousemove(e) {
                if (this._dragging == false) {
                    return;
                }
                let mpoint = this._canvas.transform({x: e.clientX, y: e.clientY});
                let x = this._x + mpoint.x - this._px;
                let y = this._y + mpoint.y - this._py;
                let d = Math.sqrt((x * x) + (y * y));
                if (d <= (this._r - 2)) {
                    this._x = x;
                    this._y = y;
                    this.draw();
                }
                this._px = mpoint.x;
                this._py = mpoint.y;
            }

            mouseup(e) {
                this._dragging = false;
                this._animations = [];
                this._animations.push(this._canvas.animate({name: "cx", to: this._cx, duration: "0.3s"}));
                this._animations.push(this._canvas.animate({name: "cy", to: this._cy, duration: "0.3s"}));
                 this.draw();
            }

            draw() {
                this._canvas.tag().innerHTML = "";
                this._canvas.draw_circle(this._cx, this._cy, this._r, { fill: this._background });

                let x = this._x + this._cx;
                let y = this._y + this._cy;
                let obj = this._canvas.draw_circle(x, y, 5, { fill: "pink" });
                if (this._animations.length > 0) {
                    for(let i=0; i<this._animations.length; i++) {
                        obj.appendChild(this._animations[i]);
                        this._animations[i].beginElement();
                        console.log(this._animations[i]);
                    }
                    console.log(this._animations.length + " animated.");
                    this._animations = [];
                    this._x = 0;
                    this._y = 0;
                }
            }
        }
    },
    joystick: {
        create: function(ename, param) {
            let canvas = null;
            switch(param.render) {
                case "svg":
                    canvas = new ko2js.classes.Canvas("svg");
                    break;
            }
            let etag = document.getElementById(ename);
            canvas.resize(etag.clientWidth, etag.clientHeight);
            canvas.viewport(0, 0, etag.clientWidth, etag.clientHeight);
            let gui = new ko2js.gui.classes.Joystick(canvas, param);
            etag.appendChild(canvas.tag());
        }
    }
};

// page
ko2js.page = {
    onload: [],
    add_onload : function(f) {
        ko2js.page.onload.push(f);
    },
    reformat: function() {
        // toc
        let toc = document.getElementById("toc");
        if (toc != null) {
            ko2js.toc.view(toc);
        }

        // code
        ko2js.code.view();

        // diagram
        ko2js.diagram.sequence.viewByClassName();

        //
        for(let i=0; i<ko2js.page.onload.length; i++) {
            ko2js.page.onload[i]();
        }
    }
};
