<template>
  <el-container>
    <el-header>
      <slot name="header"></slot>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <slot name="aside"></slot>
      </el-aside>
      <el-container :style="{minHeight: siteContentViewHeight + 'px'}">
        <el-main>
          <div class="main">
            <slot name="main"></slot>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Table',
  data () {
    return {
    }
  },
  computed: {
    documentClientHeight: {
      get () { return this.$store.state.common.documentClientHeight }
    },
    siteTableViewHeight: {
      get () { return this.$store.state.common.tableHeight }
    },
    siteContentViewHeight () {
      return this.documentClientHeight - 60
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header, .el-footer {
  color: #333;
  padding: 0;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  padding: 0;
}
.main {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  height: 100%;
}
</style>
