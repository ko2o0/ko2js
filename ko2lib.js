// Copyright (C) 2023 ko2 All right Reserved.

ko2js = {};

// classes
ko2js.classes = { };

ko2js.classes.Render = class {
    constructor() { }
    tag() { }
    reszize(w, h) { }
    viewport(x, y, w, h) { }
    draw_line(x1, y1, x2, y2, spec) { }
    draw_rectangle(x, y, w, h, spec)  { }
    draw_circle(x, y, r, spec) { }
    draw_string(str, x, y, spec) { }
};

ko2js.classes.RenderCanvas = class extends ko2js.classes.Render {
    constructor() {
        super();
    }
};

ko2js.classes.RenderSVG = class extends ko2js.classes.Render {
    constructor() {
        super();

        this._svg = this.create_element("svg");
        this._svg.style.background = "skyblue";

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
    }

    draw_circle(x, y, r, spec) {
        let obj = this.create_element("ellipse");
        this._g.appendChild(obj);
        obj.setAttributeNS(null, "x", x);
        obj.setAttributeNS(null, "y", y);
        obj.setAttributeNS(null, "width", r);
        obj.setAttributeNS(null, "height", r);
        this._svg.appendChild(obj);
    }

    draw_string(str, x, y, spec) {
        let obj = this.create_element("text");
        this._g.appendChild(obj);
        obj.setAttributeNS(null, "x", x);
        obj.setAttributeNS(null, "y", y);
        obj.innerHTML = str;
        obj.setAttributeNS(null, "stroke", this.get_value(spec, "stroke", "black"));
        obj.setAttributeNS(null, "fill", this.get_value(spec, "fill", "none"));
        obj.setAttributeNS(null, "font-family", this.get_value(spec, "font.family", "Consolas"));
        obj.setAttributeNS(null, "font-size", this.get_value(spec, "font.size", "0.8em"));
        this._svg.appendChild(obj);
    }
};

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
        this._renderer.draw_line(x1, y1, x2, y2, spec);
    }

    draw_rectangle(x1, y1, x2, y2, spec) {
        this._renderer.draw_rectangle(x1, y1, x2, y2, spec);
    }

    draw_circle(x, y, r, spec) {
        this._renderer.draw_circle(x, y, r, spec);
    }

    draw_string(str, x, y, spec) {
        this._renderer.draw_string(str, x, y, spec);
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

// ko2js.code
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

//
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
                    let x1 = px + uw * this._seqs[i].srcid + hW;
                    let x2 = px + uw * this._seqs[i].desid + hW;
                    console.log(x1 + " - " + x2);
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
                    
                    sy += this._config.boxH;
                }
            }

            tag() {
                console.log(this._canvas.tag());
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
        }
    },
    sequence: {
        create_line: function(items) {
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
            let line = new ko2js.diagram.classes.SequenceLine(
                items[param.src], items[param.des], param.atype
            );
            return line;
        },
        config: {
        },
        view: function() {
            let elist = document.getElementsByClassName("sequence");
            let n = elist.length;
            for(let i=0; i<n; i++) {
                let script = elist[i];
                let lines = script.innerText.split("\n");
                let diagram = new ko2js.diagram.classes.Sequence("svg");
                for(let j=0; j<lines.length; j++) {
                    let items = lines[j].trim().split(" ");
                    let seqline = ko2js.diagram.sequence.create_line(items);
                    if (seqline != null) {
                        diagram.add(seqline);
                    }
                }
                diagram.draw();

                let tag = diagram.tag();
                document.body.insertBefore(tag, script);
            }
        }
    },
};

// page
ko2js.page = {
    reformat: function() {
        let toc = document.getElementById("toc");
        if (toc != null) {
            ko2js.toc.view(toc);
        }

        // code
        ko2js.code.view();

        // diagram
        ko2js.diagram.sequence.view();
    }
};
