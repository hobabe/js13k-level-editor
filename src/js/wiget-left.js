// register the grid component
 Vue.component("wiget-left", {
  props: ['dataMap'],
  data: function() {
    return {
      mapListText: ''
    };
  },
  computed: {
    
  },
  methods: {
    getList(){
      this.mapListText = JSON.stringify(this.dataMap.list);
    },
    fromList(){
      this.dataMap.list = JSON.parse(this.mapListText)
    },
    deleteMap(index){
      this.dataMap.list.splice(index, 1);
    }
  },
  created(){
  },
  template: `
  <div>
    <h4 class="d-flex justify-content-between align-items-center mb-3">
      <span class="text-muted">Leveling</span>
      <span class="badge badge-secondary badge-pill">3</span>
    </h4>
    <ul class="list-group mb-3" id="level-max-height">
        <li v-for="(item, index) in dataMap.list" v-on:click="dataMap.loadEdit(item.code); dataMap.index=index" class="list-group-item d-flex justify-content-between lh-condensed"
                :class="{'bg-danger text-white': dataMap.index == index}">
            <div>
                <h6 class="my-0">Map size [{{item.map.length}}]</h6>
                <button type="button" class="btn btn-warning btn-sm border border-light" v-on:click="deleteMap(index)">Small button</button>
            </div>
            <span class="text-muted">{{index}}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <span>Total (USD)</span>
            <strong>$20</strong>
        </li>
    </ul>

    <form class="card p-2">
        <div class="input-group">
            <div class="input-group-append">
                <button type="button" class="btn btn-secondary" v-on:click="">No thing</button>
                <button type="button" class="btn btn-primary" v-on:click="fromList()">From List</button>
                <button type="button" class="btn btn-success" v-on:click="getList()">Get List</button>
            </div>
        </div>
    </form>

    
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value="123" v-model="mapListText"></textarea>
  </div>
  `,
});