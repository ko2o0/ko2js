// Copyright (C) 2023 ko2 All right Reserved.

/*
** 名前規則
** ko2js.classes.??? : 基本クラスの定義
** ko2js.<名前空間>.classes : 特定領域のクラス
** ko2js.<名前空間>.??? : 特定領域の関数
*/

////////////////////////////////////////////////////////////////////////////////
ko2js = {};

////////////////////////////////////////////////////////////////////////////////
// base classes
ko2js.classes = {};

////////////////////////////////////////////////////////////////////////////////
// table
ko2js.classes.data = {
    Dim2 : class {
        constructor(xdim, ydim) {
            this._xdim = xdim;
            this._ydim = ydim;
            this._array = [];
            for(let y=0; y<ydim; y++) {
                let ary = [];
                this._array.push(ary);
                for(let x=0; x<xdim; x++) {
                    ary.push([]);
                }
            }
        }
        
        get xdim() {
            return this._xdim;
        }

        get ydim() {
            return this._ydim;
        }

        put(x, y, value) {
            this._array[y][x] = value;
        }

        get(x, y) {
            return this._array[y][x];
        }

        dump() {
            for(let y=0; y<this._ydim; y++) {
                let line =  y + " | ";
                for(let x=0; x<this._xdim; x++) {
                    line += this._array[y][x] + " ";
                }
                console.log(line);
            }
        }
    }
};

////////////////////////////////////////////////////////////////////////////////
// 特定領域クラス群
ko2js.renderer = {};    // レンダー基本クラス
ko2js.canvas = {};      // キャンバス
ko2js.tokenizer = {};   // 字句解析基本クラス
ko2js.graph = {};       // グラフ理論基本クラス
ko2js.plotter = {};     // グラフ
ko2js.uml = {};         // UML
ko2js.gui = {};         // GUI
ko2js.pict = {};        // PICT
ko2js.wsys = {};        // Window system
ko2js.page = {};        // ページ

////////////////////////////////////////////////////////////////////////////////
// renderer
ko2js.renderer = {
    classes: {
        Renderer: class {
            constructor() {
                this._tag = null;
                this._x = 0; this._y = 0; this._w = 0; this._h = 0;
             }
            tag() { return this._tag; }
            resize(w, h) { this._w = w; this._h = h; }
            viewport(x, y, w, h) { }
            draw_line(x1, y1, x2, y2, spec) { }
            draw_rectangle(x, y, w, h, spec)  { }
            draw_circle(x, y, r, spec) { }
            draw_string(str, x, y, spec) { }
            transform(p) { return {x: p.x, y: p.y}; }
            animate(config) {}
        },
    }
};

// svg
ko2js.renderer = {
    classes : {
        SVG : class extends ko2js.renderer.classes.Renderer {
            constructor() {
                super();

                this._tag = this.create_element("svg");
                //this._tag.style.background = "skyblue";

                let marker = this.create_element("marker");
                marker.id = "arrow1";
                marker.setAttributeNS(null, "markerWidth", "20");
                marker.setAttributeNS(null, "markerHeight", "10");
                marker.setAttributeNS(null, "refX", "10");
                marker.setAttributeNS(null, "refY", "5");
                marker.innerHTML = "<polygon points='0,0 10,5 0,10' stroke='black' />";
                marker.setAttributeNS(null, "orient", "auto");
                this._tag.appendChild(marker);

                marker = this.create_element("marker");
                marker.id = "arrow2";
                marker.setAttributeNS(null, "markerWidth", "20");
                marker.setAttributeNS(null, "markerHeight", "10");
                marker.setAttributeNS(null, "refX", "10");
                marker.setAttributeNS(null, "refY", "5");
                marker.innerHTML = "<line x1=0 y1=0 x2=10 y2=5 stroke='black' />"
                    + "<line x1=10 y1=5 x2=0 y2=10 stroke='black' />";
                marker.setAttributeNS(null, "orient", "auto");
                this._tag.appendChild(marker);

                this._g = this.create_element("g");
                this._tag.appendChild(this._g);
            }

            create_element(type) {
                return document.createElementNS("http://www.w3.org/2000/svg", type);
            }

            tag() {
                return this._tag;
            }

            resize(w, h) {
                super.resize(w, h);

                this._tag.setAttributeNS(null, "width", this._w);
                this._tag.setAttributeNS(null, "height", this._h);
            }

            viewport(x, y, w, h) {
                this._vx = x;
                this._vy = y;
                this._vw = w;
                this._vh = h;
                let value = x + " " + y + " " + w + " " + h;
                this._tag.setAttributeNS(null, "viewport", value);
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
                this._tag.appendChild(obj);
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
                this._tag.appendChild(obj);
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
                this._tag.appendChild(obj);
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
                this._tag.appendChild(obj);
                return obj;
            }

            transform(org) {
                let svg = this._tag;
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
        }
    }
};

////////////////////////////////////////////////////////////////////////////////
// general canvas
ko2js.canvas.classes = {
    Canvas : class {
        constructor(type) {
            this._renderer = null;
            switch(type) {
                case "canvas":
                    this._renderer = new ko2js.renderer.classes.Canvas();
                    break;
                case "svg":
                    this._renderer = new ko2js.renderer.classes.SVG();
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
    }
};

////////////////////////////////////////////////////////////////////////////////
// renderer
ko2js.tokenizer = {
    classes: {
        Tokenizer : class {
            constructor(buf) {
                this.load(buf);
            }

            load(buf) {
                this._buf = buf;
                this._cursor = 0;
            }

            eot() { // end of text
                return this._cursor >= this._buf.length;
            }

            getchar() {
                return this._buf[this._cursor++];
            }

            ungetchar() {
                this._cursor--;
                if (this._cursor < 0) {
                    this._cursor = 0;
                }
            }

            is_alpha(c) {
                if (((c >= "A") && (c <= "Z")) || ((c >= "a") && (c <= "z")) || (c == "_")) {
                    return true;
                } else {
                    return false;
                }
            }

            token() {
                while(this.eot() == false) {
                    let c = this.getchar();
                    // skip whitespace
                    while(this.eot() == false) {
                        if (c != " ") {
                            break;
                        }
                        c = this.getchar();
                    }
                    let str = "";
                    //console.log("c="+c);
                    switch(c) {
                        case "-": case "<": case ">": case "[": case "]": 
                        case "=":
                            return {type: "op", text: c};
                        case ";":
                            return {type: "eol", text: c};
                        case "\n":
                            break;
                        case "\"":
                            str = "";
                            c = this.getchar();
                            while(this.eot() == false) {
                                if (c == "\"") {
                                    break;
                                }
                                str += c;
                                c = this.getchar();
                            }
                            return {type: "string", text: str};
                        case "0": case "1": case "2": case "3": case "4":
                        case "5": case "6": case "7": case "8": case "9":
                            str = "";
                            while(this.eot() == false) {
                                if ((c < 0x30) || (c > 0x39) || (c != '.')) {
                                    this.ungetchar();
                                    break;
                                }
                                str += c;
                                c = this.getchar();
                            }
                            return {type: "number", text: str};
                        default:
                            str = "";
                            while(this.eot() == false) {
                                if (! this.is_alpha(c)) {
                                    this.ungetchar();
                                    break;
                                }
                                str += c;
                                c = this.getchar();
                            }
                            return {type: "keyword", text: str};
                            break;
                    }
                }
                return null;
            }
        }
    }
};

////////////////////////////////////////////////////////////////////////////////
// graph theory
ko2js.graph.classes = { // base class
    Layouter : class {
        layout(g) {
        }
    }
};

ko2js.graph = {
    classes: {
        Graph: class {
            constructor() {
                this._vertecies = [];
                this._edges = [];
            }

            get vertecies() {
                return this._vertecies;
            }

            get edges() {
                return this._edges;
            }

            find_vertex_index(text) {
                for(let i=0; i<this._vertecies.length; i++) {
                    if (text == this._vertecies[i].Text) {
                        return i;
                    }
                }
                return null;
            }

            get_vertex_at(i) {
                return this._vertecies[i];
            }

            create_vertex(text) {
                for(let i=0; i<this._vertecies.length; i++) {
                    if (text == this._vertecies[i].Text) {
                        return this._vertecies[i];
                    }
                }
                let vertex = new ko2js.graph.classes.Vertex(text);
                this._vertecies.push(vertex);
                return vertex;
            }

            create_edge(src, dst) {
                let edge = new ko2js.graph.classes.Edge(src, dst);
                this._edges.push(edge);
                return edge;
            }

            layout(layouter) {
                layouter.layout(this);
            }

            draw() {
                
            }
        },
        Vertex: class {
            constructor() {
                this._x = 0;
                this._y = 0;
                this._w = 0;
                this._h = 0;
                this._text = "";
                this._backColor = "#abc";
                this._foreColor = "black";
                if (arguments.length > 0) {
                    this._text = arguments[0];
                }
            }

            set X(value) { this._x = value; }
            get X() { return this._x; }
            set Y(value) { this._y = value; }
            get Y() { return this._y; }
            set W(value) { this._w = value; }
            get W() { return this._w; }
            set H(value) { this._h = value; }
            get H() { return this._h; }
            set Text(value) { this._text = value; }
            get Text() { return this._text; }
            set ForeColor(value) { this._foreColor = value; }
            set BackColor(value) { this._backColor = value; }
        },
        Edge: class {
            constructor() {
                this._src = null;
                this._dst = null;
                if (arguments.length > 0) {
                    this._src = arguments[0];
                    this._dst = arguments[1];
                }
            }
            get src() {
                if (arguments.length > 0) {
                    this._src = arguments[0];
                }
                return this._src;
            }
            get dst() {
                if (arguments.length > 0) {
                    this._dst = arguments[0];
                }
                return this._dst;
            }
        },
        LayoutVertical: class extends ko2js.graph.classes.Layouter {
            constructor() {
                super();
            }

            layout(g) {

            }
        }
    },
    parse_relation: function(g, line) {
        if (line.length == 0) {
            return;
        }
        //console.log(">" + line);
        let tokenizer = new ko2js.tokenizer.classes.Tokenizer(line);
        let safety = 20;

        let token = null;
        while(true) {
            // source
            token = tokenizer.token();
            if (token == null) { break; }
            let v1 = g.create_vertex(token.text);

            // remove - and >
            token = tokenizer.token();
            token = tokenizer.token();
            if (token == null) { break; }

            // destination
            token = tokenizer.token();
            if (token == null) { break; }
            let v2 = g.create_vertex(token.text);

            // relation
            let edge = g.create_edge(v1, v2);

            // attributes
            token = tokenizer.token();
            if (token.type == "eol") {
                break;
            } else if (token.text == "[") {
                while(true) {
                    token = tokenizer.token();
                    if (token.text == "]") {

                    } else if (token.text == ";") {
                        break;
                    }
                }
            }

            safety--;
            if (safety <= 0) {
                console.log("[WARNING] safety break");
                break;
            }
        }
    },
    reformat() {
        let g = new ko2js.graph.classes.Graph();
        let elist = document.getElementsByClassName("graph");
        for(let i=0; i<elist.length; i++) {
            let text = elist[i].innerText;
            let lines = text.split("\n");
            for(let j=0; j<lines.length; j++) {
                let items = lines[j].trim().split(" ");
                if (items[1] == "->") {
                    ko2js.graph.parse_relation(g, lines[j].trim());
                }
            }
        }

        // topological sort
        let sorted = ko2js.graph.topological_sort(g);

        // layout
        g.layout(new ko2js.graph.classes.LayoutVertical());
    },
    topological_sort: function(g) {
        // create a table
        let n = g.vertecies.length;
        let ary = new ko2js.classes.data.Dim2(n, n);
        for(let y=0; y<n; y++) {
            for(let x=0; x<n; x++) {
                ary.put(x, y, 0);
            }
        }
        // put a data to table
        for(let i=0; i<g.edges.length; i++) {
            let edge = g.edges[i];
            let isrc = g.find_vertex_index(edge.src.Text);
            let idst = g.find_vertex_index(edge.dst.Text);
            //console.log(edge.src.Text + "(" + isrc + ")->" + edge.dst.Text + "(" + idst + ")");
            ary.put(isrc, idst, 1);
        }
        //ary.dump();

        //
        let order = [];
        let total = 0;
        let safety = 10;
        while(true) {
            total = 0;
            let count = 0;
            let found = [];

            //
            for(let y=0; y<ary.ydim; y++) {
                for(let x=0; x<ary.xdim; x++) {
                    if (ary.get(x,y) != 0) { count++; }
                }
                total += count;
                if (count == 0) {
                    let has = false;
                    for(let i=0; i<order.length;i++) {
                        if (y == order[i]) {
                            has = true;
                            break;
                        }
                    }
                    if (has == false) {
                        found.push(y);
                    }
                }
            }

            //
            for(let i=0; i<found.length; i++) {
                for(let y=0; y<ary.ydim; y++) {
                    ary.put(found[i], y, 0);
                }
                order.push(found[i]);
                //order.push(g.get_vertex_at(found[i]));
            }

            //console.log("--");
            //ary.dump();

            // terminate
            if (total == 0) {
                break;
            }

            safety--;
            if (safety < 0) {
                console.log("[WARNING] safety block.");
                break;
            }
        }
        //console.log(order);

        let result = [];
        for(let i=0; i<order.length; i++) {
            result.push(g.get_vertex_at(order[i]));
        }
        return result;
    }
}

////////////////////////////////////////////////////////////////////////////////
// plotter
ko2js.plotter.classes = { // base class definition
    AxisGraph : class {
        constructor(render) {
            this._render = render;
            this._background = "#aaa";
            this._xpad = 10;
            this._ypad = 10;

            this._xmin = 0;
            this._xmax = 1;
            this._ymin = 0;
            this._ymax = 1;
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
    }
};

ko2js.plotter = {
    classes : { // derived class definition
        ScatterPlot: class extends ko2js.plotter.classes.AxisGraph {
            constructor(canvas) {
                super(canvas);
                this._data = null;
            }

            add(data) {
                this._data = data;
            }

            draw() {
                //console.log("draw");

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
        Histogram: class extends ko2js.plotter.classes.AxisGraph {
            constructor(canvas) {
                super(canvas);
            }
        },
        ScrolledCurve: class extends ko2js.plotter.classes.AxisGraph {
            constructor(canvas) {
                super(canvas);
                this._data = [];
            }

            add(data) {
                this._data.push(data);
                if (this._data.length >= this._xmax) {
                    this._data.shift();
                }
                this.draw();
            }

            xrange(xmin, xmax, autoscale) {
                super.xrange(xmin, xmax, 0);
                for(let x=xmin; x<=xmax; x++) {
                    this._data.push(null);
                }
            }

            draw() {
                if (this._data == null) {
                    super.draw(); // draw only axis.
                    return;
                }

                super.draw();

                let first = 0;
                let lx = 0;
                let ly = 0;
                for(let i=0; i<this._data.length; i++) {
                    if (this._data[i] == null) {
                        continue;
                    }
                    let gx = this.px2gx(i);
                    let gy = this.py2gy(this._data[i]);
                    if (first == 0) {
                        first = 1;
                        lx = gx;
                        ly = gy;
                    }
                    this._render.draw_line(lx, ly, gx, gy, {stroke: "orange"});
                    lx = gx;
                    ly = gy;
                }
            }
        },
    },
    scatter : {
        create: function(ename, spec) {
            let screen = document.getElementById(ename); // tagName
            let canvas = null;
            switch(spec.render) {
                case "svg":
                    canvas = new ko2js.canvas.classes.Canvas("svg");
                    break;
            }
            let graph = new ko2js.plotter.classes.ScatterPlot(canvas);
            graph.locate(0, 0, screen.clientWidth, screen.clientHeight);
            screen.appendChild(canvas.tag());
            return graph;
        }
    },
    scrolled_curve: {
        create: function(ename, spec) {
            let screen = document.getElementById(ename); // tagName
            let canvas = null;
            switch(spec.render) {
                case "svg":
                    canvas = new ko2js.canvas.classes.Canvas("svg");
                    break;
            }
            let graph = new ko2js.plotter.classes.ScrolledCurve(canvas);
            graph.locate(0, 0, screen.clientWidth, screen.clientHeight);
            screen.appendChild(canvas.tag());
            return graph;
        }
    },
    reformat: function() {

    }
};

////////////////////////////////////////////////////////////////////////////////
// uml
ko2js.uml = {
    classes : {
        Sequence : class {
            constructor() {
                this._canvas = new ko2js.canvas.classes.Canvas("svg");
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
            let seqline = new ko2js.uml.classes.SequenceLine(
                items[param.src], items[param.des], ko2js.uml.sequence.atype_id(items[1])
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
        reformat: function() {
            let elist = document.getElementsByClassName("sequence");
            let n = elist.length;
            for(let i=0; i<n; i++) {
                let script = elist[i];
                let lines = script.innerText.split("\n");
                let diagram = new ko2js.uml.classes.Sequence("svg");
                for(let j=0; j<lines.length; j++) {
                    let seqline = ko2js.uml.sequence.create_line(lines[j]);
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
            let diagram = new ko2js.uml.classes.Sequence("svg");
            for(let i=0; i<seqlist.length; i++) {
                let seq = seqlist[i];
                let seqline = new ko2js.uml.classes.SequenceLine(
                    seq.src, seq.des, ko2js.uml.sequence.atype_id(seq.atype)
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
    reformat: function() {
        ko2js.uml.sequence.reformat();
    }
};

////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////
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
                this._border = param.border;
                this._x = 0;
                this._y = 0;

                this._binding = null;
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

            binding(param) {
                this._binding = param;
            }

            draw() {
                this._canvas.tag().innerHTML = "";
                this._canvas.draw_circle(this._cx, this._cy, this._r, { fill: this._background, stroke: this._border });

                let x = this._x + this._cx;
                let y = this._y + this._cy;
                let obj = this._canvas.draw_circle(x, y, 5, { fill: "pink" });
                if (this._animations.length > 0) {
                    for(let i=0; i<this._animations.length; i++) {
                        obj.appendChild(this._animations[i]);
                        this._animations[i].beginElement();
                        //console.log(this._animations[i]);
                    }
                    //console.log(this._animations.length + " animated.");
                    this._animations = [];
                    this._x = 0;
                    this._y = 0;
                }

                if (this._binding != null) {
                    switch(this._binding.type) {
                        case "text":
                            document.getElementById(this._binding.id).innerText = "(" + this._x + "," + this._y + ")";
                            break;
                    }
                }
            }
        }
    },
    joystick: {
        create: function(ename, param) {
            let canvas = null;
            switch(param.render) {
                case "svg":
                    canvas = new ko2js.canvas.classes.Canvas("svg");
                    break;
            }
            let etag = document.getElementById(ename);
            canvas.resize(etag.clientWidth, etag.clientHeight);
            canvas.viewport(0, 0, etag.clientWidth, etag.clientHeight);
            let gui = new ko2js.gui.classes.Joystick(canvas, param);
            etag.appendChild(canvas.tag());

            if (typeof(param.binding) != "undefined") {
                gui.binding(param.binding);
            }
        }
    }
};

////////////////////////////////////////////////////////////////////////////////
//
ko2js.picture = {
    classes : {

    },
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
    }
};

////////////////////////////////////////////////////////////////////////////////
// page
ko2js.page = {
    toc: function() {
        let toc = document.getElementById("toc");
        if (toc == null) {
            return;
        }
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
    },
    formatter: {
        cxx: function(text) {
            text = text.replaceAll("<", "&lt;");
            text = text.replaceAll(">", "&gt;");
            text = text.replaceAll(/(\#define)/g, "<span class=keyword01>$1</span>");
            text = text.replaceAll(/(\#include)/g, "<span class=keyword01>$1</span>");
            return text;
        }
    },
    code: function() {
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
                    text += ko2js.page.formatter.cxx(line) + "<br>";
                }
            }
            text += "</pre>";
            script.insertAdjacentHTML('beforebegin', text);
        }
    },
    onload: [],
    add_onload : function(f) {
        ko2js.page.onload.push(f);
    },
    reformat: function() {
        // auto format
        ko2js.page.toc();
        ko2js.page.code();
        ko2js.uml.reformat();
        ko2js.plotter.reformat();
        ko2js.graph.reformat();

        // onload
        for(let i=0; i<ko2js.page.onload.length; i++) {
            ko2js.page.onload[i]();
        }
    }
}

