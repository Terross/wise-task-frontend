<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  getCurrentInstance,
  h,
  ref
} from 'vue';
import React from 'react';
import ReactDOM from 'react-dom/client';

type ReactRoot = ReturnType<typeof ReactDOM.createRoot> | null;

export default defineComponent({
  props: {
    loadComponent: {
      type: Function,
      required: true,
    },
  },
  setup(props, { attrs }) {
    let container: HTMLDivElement | null = null;
    let reactRoot: ReactRoot = null;
    let mounted = false;
    const loadedReactComponent = ref<any>(null);

    const renderReactComponent = () => {
      const ComponentToRender = loadedReactComponent.value;

      if (container && ComponentToRender) {
        if (typeof ComponentToRender !== 'function' && !(ComponentToRender && typeof ComponentToRender === 'object' && '$$typeof' in ComponentToRender)) {
          console.error(
              "Error: Component is not a valid React component type after loading. Got:",
              ComponentToRender,
              "Ensure the module exports a default React component function or class."
          );
          return;
        }

        const reactElement = React.createElement(ComponentToRender, {
          ...attrs,
        });

        if (ReactDOM.createRoot) { // React 18+
          if (!reactRoot) {
            reactRoot = ReactDOM.createRoot(container);
          }
          reactRoot.render(reactElement);
        } else {
          ReactDOM.render(reactElement, container);
        }
      }
    };

    const loadAndRender = async () => {
      loadedReactComponent.value = null;
      if (!props.loadComponent) {
        console.warn('loadComponent prop is missing.');
        return;
      }
      try {
        const module = await props.loadComponent();
        loadedReactComponent.value = module.default || module;
        if (mounted) {
          nextTick(renderReactComponent);
        }
      } catch (error) {
        console.error("Failed to load React microfrontend:", error);
      }
    };

    onMounted(() => {
      container = document.createElement('div');
      const rootElement = (getCurrentInstance()?.vnode.el as HTMLElement);
      if (rootElement) {
        rootElement.appendChild(container);
      } else {
        console.warn("Vue component's root element not found. Appending React microfrontend to body.");
        document.body.appendChild(container);
      }
      mounted = true;
      loadAndRender();
    });

    watch(() => props.loadComponent, loadAndRender);

    watch(attrs, () => {
      if (mounted && loadedReactComponent.value) {
        nextTick(renderReactComponent);
      }
    }, { deep: true });


    onUnmounted(() => {
      if (container) {
        if (reactRoot) {
          reactRoot.unmount();
        } else if (ReactDOM.unmountComponentAtNode) {
          ReactDOM.unmountComponentAtNode(container);
        }
        container.remove();
        container = null;
        reactRoot = null;
        mounted = false;
      }
    });

    return () => h('div', {
      style: 'width: 100%; height: 100%;'
    });
  },
});
</script>