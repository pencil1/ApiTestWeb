
<template lang="jade">
.vue-scrollbar__wrapper(
  v-el:scroll-wrapper
  v-bind:class="classes ? ' ' + classes : ''")
  .vue-scrollbar__area(
    @wheel="scroll"
    v-el:scroll-area
    @touchstart="startDrag"
    @touchmove="onDrag"
    @touchend="stopDrag"
    v-bind:class="(dragging ? '' : 'vue-scrollbar-transition')"
    v-bind:style="{ 'margin-top': top * -1 +'px', 'margin-left': left * -1 +'px' }"
  )

    slot

  vertical-scrollbar(
    v-if="ready"
    v-bind:area="{ height: scrollAreaHeight }"
    v-bind:wrapper="{ height: scrollWrapperHeight }"
    v-bind:scrolling="{ v: vMovement }"
    v-bind:dragging-from-parent="dragging"
    v-bind:on-change-position="handleChangePosition"
  )

  horizontal-scrollbar(
    v-if="ready"
    v-bind:area="{ width: scrollAreaWidth }"
    v-bind:wrapper="{ width: scrollWrapperWidth }"
    v-bind:scrolling="{ h: hMovement }"
    v-bind:dragging-from-parent="dragging"
    v-bind:on-change-position="handleChangePosition"
  )

</template>

<script>

  import verticalScrollbar from './vertical-scrollbar.vue';
  import horizontalScrollbar from './horizontal-scrollbar.vue';

  require('../../sass/_Scrollbar.sass');

  export default {

    props: {
      classes: {
        type: String,
        default: ""
      },
      speed: {
        type: Number,
        default: 53
      }
    },

    data(){
      return{
        ready: false,
        scrollY: null,
        scrollX: null,
        top: 0,
        left: 0,
        scrollAreaHeight: null,
        scrollAreaWidth: null,
        scrollWrapperHeight: null,
        scrollWrapperWidth: null,
        verticalHeight: null,
        vMovement: 0,
        hMovement: 0,
        dragging: false,
        start: { y: 0, x: 0}
      }
    },

    components: { verticalScrollbar, horizontalScrollbar },

    methods: {
      scroll(e){
        e.preventDefault()

        // Set the wheel step
        let num = this.speed

        // DOM events
        let shifted = e.shiftKey
        this.scrollY = e.deltaY > 0 ? num : -(num)
        this.scrollX = e.deltaX > 0 ? num : -(num)

        // Fix Mozilla Shifted Wheel~
        if(shifted && e.deltaX == 0) this.scrollX = e.deltaY > 0 ? num : -(num)

        // Next Value
        let nextY = this.top + this.scrollY
        let nextX = this.left + this.scrollX

        // Is it Scrollable?
        let canScrollY = this.scrollAreaHeight > this.scrollWrapperHeight
        let canScrollX = this.scrollAreaWidth > this.scrollWrapperWidth

        // Vertical Scrolling
        if(canScrollY && !shifted) {
          this.normalizeVertical(nextY)
          this.moveTheScrollbar()
        }

        // // Horizontal Scrolling
        if(shifted && canScrollX) {
          this.normalizeHorizontal(nextX)
          this.moveTheScrollbar()
        }

      },

      // DRAG EVENT JUST FOR TOUCH DEVICE~
      startDrag(e){

        e.preventDefault()
        e.stopPropagation()

        e = e.changedTouches ? e.changedTouches[0] : e


        // Prepare to drag
        this.dragging = true
        this.start.y = e.pageY
        this.start.x = e.pageX


      },
      onDrag(e){

        if(this.dragging){

          e.preventDefault()
          e = e.changedTouches ? e.changedTouches[0] : e


          // Invers the Movement
          let yMovement = this.start.y - e.pageY
          let xMovement = this.start.x - e.pageX


          // Update the last e.page
          this.start.y = e.pageY
          this.start.x = e.pageX


          // The next Vertical Value will be
          let nextY = this.top + yMovement
          let nextX = this.left + xMovement


          this.normalizeVertical(nextY)
          this.normalizeHorizontal(nextX)

          this.moveTheScrollbar()
        }

      },

      stopDrag(e){
        this.dragging = false
      },


      normalizeVertical(nextY){
        // Vertical Scrolling
        let lowerEnd = this.scrollAreaHeight - this.scrollWrapperHeight

        // Max Scroll Down
        if(nextY > lowerEnd) nextY = lowerEnd

        // Max Scroll Up
        else if(nextY < 0) nextY = 0

        // Update the Vertical Value
        this.top = nextY
      },

      normalizeHorizontal(next){
        // Horizontal Scrolling
        let rightEnd = this.scrollAreaWidth - this.scrollWrapperWidth

        // Max Scroll Right
        if(next > rightEnd) next = rightEnd;

        // Max Scroll Right
        else if(next < 0) next = 0

        // Update the Horizontal Value
        this.left = next
      },


      moveTheScrollbar(){
        this.vMovement = this.top / this.scrollAreaHeight * 100;
        this.hMovement = this.left / this.scrollAreaWidth * 100;
      },


      handleChangePosition(vScrollbar, orientation){
        // Convert Percentage to Pixel
        let next = vScrollbar / 100 * this.scrollAreaHeight
        if( orientation == 'vertical' ) this.normalizeVertical(next)
        if( orientation == 'horizontal' ) this.normalizeHorizontal(next)
      },

      calculateSize(){
        // The Elements
        let $scrollArea = this.$els.scrollArea
        let $scrollWrapper = this.$els.scrollWrapper

        // Computed Style
        let scrollWrapperStyle = window.getComputedStyle($scrollWrapper,null)

        // Scroll Area Height and Width
        this.scrollAreaHeight = $scrollArea.children[0].clientHeight
        this.scrollAreaWidth = $scrollArea.children[0].clientWidth

        // Scroll Wrapper Height and Width
        this.scrollWrapperHeight = parseFloat(scrollWrapperStyle.height)
        this.scrollWrapperWidth = parseFloat(scrollWrapperStyle.width)

        // Make sure The wrapper is Ready, then render the scrollbar
        this.ready = true
      }

    },

    ready(){
      this.calculateSize()

      // Attach The Event for Responsive View~
      window.addEventListener('resize', this.calculateSize)
    },

    beforeDestroy(){
      // Remove Event
      window.removeEventListener('resize', this.calculateSize)
    }


  };

</script>
