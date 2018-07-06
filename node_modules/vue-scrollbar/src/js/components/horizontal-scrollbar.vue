
<template lang="jade">

.vue-scrollbar__scrollbar-horizontal( v-if="width < 100" @click="jump" v-el:container )
  .scrollbar(
    v-bind:class="dragging || draggingFromParent ? '' : 'vue-scrollbar-transition'"
    v-el:scrollbar
    @touchstart="startDrag"
    @mousedown="startDrag"
    v-bind:style="{ width: width+'%', left: scrolling.h + '%' }"
  )

</template>

<script>

  export default {

    props: {
      area: {
        type: Object,
        default: 0
      },
      wrapper: {
        type: Object,
        default: 0
      },
      scrolling: {
        type: Object,
        default: { v: 0, h: 0 }
      },
      draggingFromParent: {
        type: Boolean,
        default: false
      },
      onChangePosition: {
        type: Function,
        default: () => {}
      },
    },

    data(){
      return{
        width: 0,
        dragging: false,
        start: 0
      }
    },

    watch: {
      'wrapper.width'(val,old){
        if(val != old) this.calculateSize()
      }
    },

    methods: {
      startDrag(e){

        e.preventDefault()
        e.stopPropagation()

        e = e.changedTouches ? e.changedTouches[0] : e

        // Prepare to drag
        this.dragging = true
        this.start = e.pageX
      },
      onDrag(e){

        if(this.dragging){

          e.preventDefault()
          e.stopPropagation()

          e = e.changedTouches ? e.changedTouches[0] : e

          let xMovement = e.pageX - this.start
          let xMovementPercentage = xMovement / this.wrapper.width * 100

          // Update the last e.pageX
          this.start = e.pageX

          // The next Horizontal Value will be
          let next = this.scrolling.h + xMovementPercentage

          this.normalize(next)

          // DO THIS WAY IS NOT SAFE FOR WORK!
          // But it needed to make it simple~
          this.$parent.dragging = true

          this.onChangePosition(next, 'horizontal')
        }

      },

      stopDrag(e){
        this.dragging = false
        // DO THIS WAY IS NOT SAFE FOR WORK!
        // But it needed to make it simple~
        this.$parent.dragging = false
      },

      jump(e){

        let isContainer = e.target === this.$els.container
        if(isContainer){
          // Get the Element Position
          let position = this.$els.scrollbar.getBoundingClientRect()

          // Calculate the horizontal Movement
          let xMovement = e.pageX - position.left;

          let centerize = (this.width / 2)
          let xMovementPercentage = xMovement / this.wrapper.width * 100 - centerize

          // Update the last e.pageX
          this.start = e.pageX

          // The next horizontal Value will be
          let next = this.scrolling.h + xMovementPercentage

          this.normalize(next)
          this.onChangePosition(next, 'horizontal')

        }
      },

      normalize(next){
        // Check For the Max Position
        let lowerEnd = 100 - this.width
        if(next < 0) next = 0
        if(next > lowerEnd) next = lowerEnd
        this.scrolling.h = next
      },

      calculateSize(){
        // Scrollbar Width
        this.width =  this.wrapper.width / this.area.width * 100
      }

    },

    ready(){
      this.calculateSize()

      // Put the Listener
      document.addEventListener("mousemove", this.onDrag)
      document.addEventListener("touchmove", this.onDrag)
      document.addEventListener("mouseup", this.stopDrag)
      document.addEventListener("touchend", this.stopDrag)
    },

    beforeDestroy(){
      // Remove the Listener
      document.addEventListener("mousemove", this.onDrag)
      document.addEventListener("touchmove", this.onDrag)
      document.addEventListener("mouseup", this.stopDrag)
      document.addEventListener("touchend", this.stopDrag)
    }

  };

</script>
