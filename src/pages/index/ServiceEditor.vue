<template>
  <table-component>
    <div slot="header"></div>
    <template slot="main">
      <div class="editbox-edit-panel" :style="{'min-width': (width + 40)+ 'px', 'min-height': (height +40) + 'px'}" @contextmenu.prevent>
        <div class="editbox-page" :style="{'min-width': width + 'px', 'width': width + 'px', 'min-height': height + 'px', 'height': height + 'px'}">
        </div>
      </div>
    </template>
  </table-component>
</template>

<script>
export default {
  name: 'ServiceEditor',
  data () {
    return {
      width: 1200,
      height: 800
    }
  },
  computed: {
    siteTableViewHeight: {
      get () { return this.$store.state.common.tableHeight }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* 编辑视图 */
  .editbox-edit-panel{
    background-image: url(../../assets/canvas_bg.jpg);
    flex: 1;
    height: 100%;
    /* overflow: auto; */
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  .editbox-page{
    background: white;
    position: relative;
    widows: 100%;
    background-image: url(../../assets/bg.gif);
    /* overflow: hidden; */
  }
  .editbox-page.canAddControl{
    box-shadow: 0 0 3px 2px rgba(64, 153, 255, 0.5);
  }
</style>
