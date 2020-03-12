<template>
    <div class="node" :style="{
        width: node.width * scale + 'px', 
        height: node.height * scale + 'px',
        }">
        <div class="node-image" :style="{
            backgroundImage: `url(${node.image})`, 
            width: node.width * scale + 'px', 
            height: (node.height * scale) + 'px',
            }"></div>
        <span class="node-name">{{node.name}}</span>
    </div>
</template>
<script>
export default {
    props: {
        node: {
            type: Object,
            required: true,
        },
        scale:{
            type: Number,
            required: true,
        }
    },
}
</script>
<style scoped>
    .node{
        position: absolute;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        user-select: none;
    }
    .node-image{
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }
    .node-name{
        line-height: 20px;
        height: 20px;
        position: relative;
        top: -18px;
        background-color: rgba(255, 255, 255, .6)
    }
</style>

