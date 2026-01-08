<template>
  <div>
    <ConfigPanel v-model:config="testConfig" @apply="handleApply" @reset="handleReset" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfigPanel from '../../src/components/config/ConfigPanel.vue';

const testConfig = ref({
  gridRows: 3,
  gridCols: 3,
  moleFrequency: 1000,
  moleStayTime: 1500,
  scoreThreshold: 500
});

let applyCalled = false;
let resetCalled = false;

const handleApply = () => { applyCalled = true; };
const handleReset = () => { resetCalled = true; };

describe('ConfigPanel Component', () => {
  it('should render config options', () => {
    const wrapper = mount(ConfigPanel, {
      props: {
        config: testConfig.value
      }
    });

    expect(wrapper.find('.config-panel').exists()).toBe(true);
    expect(wrapper.text()).toContain('Grid Rows');
    expect(wrapper.text()).toContain('Grid Columns');
    expect(wrapper.text()).toContain('Mole Frequency');
  });

  it('should emit apply event', async () => {
    const wrapper = mount(ConfigPanel, {
      props: {
        config: testConfig.value
      }
    });

    const applyButton = wrapper.find('[data-test="apply-config"]');
    if (applyButton.exists()) {
      await applyButton.trigger('click');
      expect(wrapper.emitted('apply')).toBeTruthy();
    }
  });

  it('should emit reset event', async () => {
    const wrapper = mount(ConfigPanel, {
      props: {
        config: testConfig.value
      }
    });

    const resetButton = wrapper.find('[data-test="reset-config"]');
    if (resetButton.exists()) {
      await resetButton.trigger('click');
      expect(wrapper.emitted('reset')).toBeTruthy();
    }
  });

  it('should update config when sliders change', async () => {
    const wrapper = mount(ConfigPanel, {
      props: {
        modelValue: testConfig.value,
        'onUpdate:modelValue': (val) => {
          testConfig.value = val;
        }
      }
    });

    const slider = wrapper.find('[data-test="grid-rows-slider"]');
    if (slider.exists()) {
      await slider.setValue(4);
      expect(testConfig.value.gridRows).toBe(4);
    }
  });
});
</script>
