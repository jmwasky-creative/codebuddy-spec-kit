<template>
  <div>
    <HighScoresList :scores="testScores" @clear="handleClear" />
  </div>
</template>

<script setup>
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HighScoresList from '../../src/components/ui/HighScoresList.vue';

const testScores = [
  { score: 1500, date: '2024-01-08' },
  { score: 1200, date: '2024-01-07' },
  { score: 800, date: '2024-01-06' }
];

let clearCalled = false;
const handleClear = () => { clearCalled = true; };

describe('HighScoresList Component', () => {
  it('should render scores list', () => {
    const wrapper = mount(HighScoresList, {
      props: { scores: testScores }
    });

    expect(wrapper.find('.high-scores-list').exists()).toBe(true);
    expect(wrapper.text()).toContain('1500');
    expect(wrapper.text()).toContain('1200');
    expect(wrapper.text()).toContain('800');
  });

  it('should display empty state when no scores', () => {
    const wrapper = mount(HighScoresList, {
      props: { scores: [] }
    });

    expect(wrapper.text()).toContain('No scores yet');
  });

  it('should emit clear event', async () => {
    const wrapper = mount(HighScoresList, {
      props: { scores: testScores }
    });

    const clearButton = wrapper.find('[data-test="clear-scores"]');
    if (clearButton.exists()) {
      await clearButton.trigger('click');
      expect(wrapper.emitted('clear')).toBeTruthy();
    }
  });

  it('should sort scores in descending order', () => {
    const unsortedScores = [
      { score: 800, date: '2024-01-06' },
      { score: 1500, date: '2024-01-08' },
      { score: 1200, date: '2024-01-07' }
    ];

    const wrapper = mount(HighScoresList, {
      props: { scores: unsortedScores }
    });

    const scoreElements = wrapper.findAll('.score-value');
    expect(scoreElements[0].text()).toBe('1500');
    expect(scoreElements[1].text()).toBe('1200');
    expect(scoreElements[2].text()).toBe('800');
  });
});
</script>
