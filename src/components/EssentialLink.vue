<template>
  <div v-if="can">
    <!-- No tiene submenus -->
    <q-item
      v-if="!children && target === '_self'"
      clickable
      tag="a"
      :to="link"
      active-class="link-active"
      :class="{ 'border-left q-ml-lg': hasParent }"
      class="text-color"
      exact
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" size="xs" class="color-icono" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      v-if="!children && target === '_blank'"
      clickable
      tag="a"
      :href="link"
      :target="target"
      active-class="link-active"
      exact
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" size="xs" class="color-icono" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-color">{{ title }}</q-item-label>
      </q-item-section>
    </q-item>

    <!-- Tiene submenus -->
    <q-expansion-item
      v-if="children"
      clickable
      tag="a"
      active-class="link-active"
      exact
    >
      <template #header>
        <q-item-section v-if="icon" avatar>
          <q-icon :name="icon" size="xs" class="color-icono" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ title }}</q-item-label>
        </q-item-section>
      </template>

      <div v-for="child in children" :key="child.title" class="q-px-xs">
        <EssentialLink
          :title="child.title ?? ''"
          :link="child.link"
          :icon="child.icon"
          :children="child.children"
          :can="child.can"
          hasParent
        ></EssentialLink>
      </div>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { MenuOption } from 'shared/menu/MenuOption'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '#',
    },
    target: {
      type: String,
      default: '_self',
    },
    icon: {
      type: String,
      default: '',
    },

    children: {
      type: Object as () => MenuOption[],
      required: false,
    },
    can: { type: Boolean, default: true },
    hasParent: { type: Boolean, default: false },
  },
})
</script>
