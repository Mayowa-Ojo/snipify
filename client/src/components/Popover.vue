<template>
   <TippyComponent
      :name="name"
      :placement="placement"
      animation="fade"
      trigger="click"
      interactive="true"
      theme="light"
   >
      <slot></slot>
   </TippyComponent>
</template>

<script>
import { TippyComponent } from "vue-tippy"
export default {
   name: "Tooltip",
   components: {
      TippyComponent
   },
   props: ["placement", "name"]
}

</script>

<style lang="scss">
.tippy-tooltip.light-theme {
   border-radius: 8px;
   padding: 0;
   border: 2px solid #E5E7EB !important;
   min-width: 100px !important;
   box-shadow: 0px 0px 21px 2px rgba(0, 0, 0, 0.05);
   .tippy-backdrop {
      background-color: white !important;
   }
}
</style>