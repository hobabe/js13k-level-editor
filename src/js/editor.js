// register the grid component
Vue.component("editor-map", {
  props: ['dataMap'],
  data: function () {
    return {
      title: "NEW EDITOR",
      sortOrders: null,
      data: {},
      result: {
        mapData: ''
      },
      cTile: null,
      CViewGen: null,
      m:0,
      T: 0,
      el: {
        mapCodeInput: null,
        widthCount: null,
        use1stTileByDefault: null,
        heightCount: null,
        tileSize: null,
        tileBoxes: null,
        mapGenBox: null,
        mapGen: null,
        pixelBox: null,
      }
    };
  },
  computed: {
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      console.log('Done');


      this.el.mapCodeInput = document.getElementById("mapCodeInput");
      this.el.widthCount = document.getElementById("widthCount");
      this.el.use1stTileByDefault = document.getElementById("use1stTileByDefault");
      this.el.heightCount = document.getElementById("heightCount");
      this.el.tileSize = document.getElementById("tileSize");

      this.el.tileBoxes = document.getElementById("tileBoxes");
      this.el.mapGenBox = document.getElementById("mapGenBox");
      this.el.mapGen = document.getElementById("mapGen");
      this.el.pixelBox = document.getElementById("pixelBox");
      this.el.shareLink = document.getElementById("shareLink");

      this.el.boxHighlight = document.getElementById("boxHighlight");

      // Tileset
      this.cTile = this.el.tileBoxes.getContext`2d`;

      // Map
      this.CViewGen = this.el.mapGen.getContext`2d`;

      this.init(this.el.mapCodeInput);

      
      //set event
      this.el.tileBoxes.onclick=e=>{

        // T = tile index
        this.T=~~((e.pageX-this.el.tileBoxes.getBoundingClientRect().left)/this.data.t);
        
        // Move red tile picker
        this.el.boxHighlight.style.left=this.T*this.data.t+"px";
      }
    })
  },
  methods: {
    init(e) {
      var el = this.el;

      // Read map hash
      if (!this.el.mapCodeInput.value) {
        // this.el.mapCodeInput.value = (decodeURI(location.hash)).slice(1);
      }
      this.data = load_level(this.el.mapCodeInput.value);

      // tile size
      if (e && this.el.mapCodeInput.value) el.tileSize.value = this.data.t;
      else this.data.t = +el.tileSize.value;

      // Map size
      if (e && this.el.mapCodeInput.value) el.widthCount.value = this.data.w;
      else this.data.w = +el.widthCount.value;

      if (e && this.el.mapCodeInput.value) el.heightCount.value = this.data.h;
      else this.data.h = +el.heightCount.value;

      // Tile zero by default
      if (e && this.el.mapCodeInput.value) el.use1stTileByDefault.checked = !!this.data.z;
      else this.data.z = +el.use1stTileByDefault.checked;

      // map as array of tile coordinates
      this.data.m = this.data.m || [];

      // map as text
      this.data.M = this.data.M || "";

      // Write map
      this.write_map();

      // Reset tileset canvas height and content
      el.tileBoxes.height = this.data.t;

      // Resize map container
      // el.mapGenBox.style.height = "calc(99vh - " + (this.data.t + 150) + "px)"

      // Load tileSize.js containing the JS part of the tileset (optional)
      var s = document.createElement("script");
      s.src = el.pixelBox.value + "/tileBoxes.js";
      s.onload = s.onerror = () => {

        // tileSize.js is executed if it exists

        // Draw tileSize.png containing the image part of the tileset (optional)  
        var I = new Image();
        I.src = el.pixelBox.value + "/t.png";
        I.onload = I.onerror = () => {
          this.cTile.drawImage(I, 0, 0);

          // Resize the tile picker
          this.el.boxHighlight.style.width = this.el.boxHighlight.style.height = this.data.t;

          // Reset map canvas size and content
          el.mapGen.width = this.data.t * this.data.w;
          el.mapGen.height = this.data.t * this.data.h;

          // Fill the map with tile 0 (if checked)
          if (el.use1stTileByDefault.checked) {
            for (var i = 0; i < this.data.w; i++) {
              for (var j = 0; j < this.data.h; j++) {
                this.CViewGen.drawImage(this.el.tileBoxes, 0, 0, this.data.t, this.data.t, i * this.data.t, j * this.data.t, this.data.t, this.data.t);
              }
            }
          }

          // Draw existing map
          for (var i in this.data.m) {
            this.CViewGen.drawImage(this.el.tileBoxes, this.data.m[i][2] * this.data.t, 0, this.data.t, this.data.t, this.data.m[i][0] * this.data.t, this.data.m[i][1] * this.data.t, this.data.t, this.data.t);
          }

          // Draw grid
          this.cTile.fillStyle = this.CViewGen.fillStyle = "#888";
          for (var i = 0; i < 5e5; i += this.data.t) {
            this.cTile.fillRect(i, 0, 1, 5e5);
            this.CViewGen.fillRect(i, 0, 1, 5e5);
          }
          for (var i = 0; i < 5e5; i += this.data.t) {
            this.cTile.fillRect(0, i, 5e5, 1);
            this.CViewGen.fillRect(0, i, 5e5, 1);
          }
        }
      };

      // Finish loading tileSize.js
      document.body.appendChild(s);
    },
    onmousemove(e) {
      // var m = this.m;
      // Get mouse coordinates
      var R = this.el.mapGen.getBoundingClientRect();
      var X = ~~((e.pageX - R.left) / this.data.t);
      var Y = ~~((e.pageY - R.top - document.body.scrollTop - document.documentElement.scrollTop) / this.data.t);

      // console.log(X,Y);
      // Remove the tile at these coordinates id left/right click is pressed
      if (this.m == 1) {
        if (this.data.z) {
          this.CViewGen.drawImage(this.el.tileBoxes, 0, 0, this.data.t, this.data.t, X * this.data.t, Y * this.data.t, this.data.t, this.data.t);
        }
        else {
          this.CViewGen.clearRect(X * this.data.t + 1, Y * this.data.t + 1, this.data.t - 1, this.data.t - 1);
        }
        for (i in this.data.m) {
          if (this.data.m[i][0] == X && this.data.m[i][1] == Y) {
            delete this.data.m[i];
          }
        }
      }

      // Draw if left click is pressed (unless the eraser is checked)
      if (this.m == 1 && !this.el.isErasechecked && !(this.T == 0 && this.data.z)) {
        this.CViewGen.drawImage(this.el.tileBoxes, this.T * this.data.t, 0, this.data.t, this.data.t, X * this.data.t, Y * this.data.t, this.data.t, this.data.t);
        this.data.m.push([X, Y, this.T]);
      }

      // Rewrite map if left/right click is pressed
      if (this.m) {
        this.write_map();
      }
    },
    write_map() {
      this.el.mapCodeInput.value = String.fromCodePoint(this.data.t + 32) + String.fromCodePoint(this.data.w + 32) + String.fromCodePoint(this.data.h + 32) + this.data.z;
      for (i in this.data.m) {
        this.el.mapCodeInput.value += String.fromCodePoint(this.data.m[i][0] + 32) + String.fromCodePoint(this.data.m[i][1] + 32) + String.fromCodePoint(this.data.m[i][2] + 32);
      }
      shareLink.href = "#" + encodeURI(this.el.mapCodeInput.value).replace(/\(/g, "%28").replace(/\)/g, "%29");
      playLink.href = pixelBox.value + "/#" + encodeURI(this.el.mapCodeInput.value).replace(/\(/g, "%28").replace(/\)/g, "%29");
      this.data.M = [];
      for (var j = 0; j < this.data.h; j++) {
        this.data.M[j] = [];
        for (var i = 0; i < this.data.w; i++) {
          this.data.M[j][i] = " ";
        }
      }

      for (var i in this.data.m) {
        if (this.data.M[this.data.m[i][1]]) {
          this.data.M[this.data.m[i][1]][this.data.m[i][0]] = String.fromCodePoint(this.data.m[i][2] + 32);
        }
      }
      map_array.innerHTML = this.data.M.map(u => u.join("")).join("\n");
      download.href = "data:text;base64," + btoa(this.data.M.map(u => u.join("")).join("\n"));
    },
    loadEdit(code) {
      this.el.mapCodeInput.value = code;
      this.init();
    },
    getDataMap(val, code){
      var rs = load_level(val);
      this.result.mapData = JSON.stringify(rs.m);

      this.dataMap.temp = this.result.mapData;

      var map = {
        map: this.result.mapData,
        code: val
      }

      switch(code){
        case "add"://add
          this.dataMap.list.push(map);
          break;
        case "update"://update
          this.dataMap.list[this.dataMap.index] = map;
          break;
        case "reset": 
          this.el.mapCodeInput.value = val;
          break;
      }
    },

  },
  created() {
    this.dataMap.loadEdit = this.loadEdit
    // this.dataMap.mapTemp = 'new'
  },//mousemove
  template: `
  <div>
    <hr>
    <p> Game URL <input id="pixelBox" value="." size=1/>
    - Tile size <input id="tileSize" value=32 size=3 v-on:keyup="this.data.t=+value;init()"/>
    - Map size <input id="widthCount" value="20" size=3 onclick="this.data.w=+value;init()"/> x 
      <input id="heightCount" value="15" size=3 onclick="this.data.h=+value;init()"/>
    - <input type=checkbox id="use1stTileByDefault" onchange="this.data.z=checked;init()" checked/> 1st default tile
    - <input type=checkbox id="isErase"/> Erase
    <p>
      Map <input id="mapCodeInput">      
      - <button id="shareLink" class="btn btn-danger" v-on:click="getDataMap('', 'reset'); init()">Reset</button>
      - <button id="shareLink" class="btn btn-info" v-on:click="getDataMap(el.mapCodeInput.value, 'update')">Update</button>
      - <button id="playLink" class="btn btn-success" v-on:click="getDataMap(el.mapCodeInput.value, 'add'); dataMap.index = dataMap.list.length-1">Add level</button>
    <p>
      <div style="border:1px solid;overflow:auto;position:relative">
        <canvas id="tileBoxes" width=2048 height=32></canvas>
        <span style="border:3px solid red;position:absolute;top:0;left:0" id="boxHighlight"></span>
      </div>
    <p>
      <div id="mapGenBox" style="border:1px solid;overflow:auto;position:relative">
        <canvas id="mapGen" oncontextmenu="return!1" @mouseup="m=0;getDataMap(el.mapCodeInput.value)" @mousemove="onmousemove" @mousedown="m=1"></canvas>
      </div>
    <br>
    Text output: <a id="download" download=map.txt href="">Download</a>
    <br>
    <p><pre id="map_array" style="border:1px solid;display:inline-block"></pre></p>
  </div>
  `,
});