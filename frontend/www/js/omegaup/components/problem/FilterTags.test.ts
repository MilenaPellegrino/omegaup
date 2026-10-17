import { mount } from '@vue/test-utils';

import T from '../../lang';
import type { types } from '../../api_types';
import problem_FilterTags from './FilterTags.vue';

describe('FilterTags.vue', () => {
  it('Should handle list of tags', () => {
    const wrapper = mount(problem_FilterTags, {
      propsData: {
        tags: [
          { name: 'problemTagMatrices', problemCount: 5 },
          { name: 'problemTagDiophantineEquations', problemCount: 4 },
          { name: 'problemTagInputAndOutput', problemCount: 3 },
          { name: 'problemTagArrays', problemCount: 2 },
        ] as types.TagWithProblemCount[],
        publicQualityTags: [
          { name: 'problemTagConditionals', problemCount: 1 },
          { name: 'problemTagLoops', problemCount: 1 },
          { name: 'problemTagFunctions', problemCount: 1 },
          { name: 'problemTagCharsAndStrings', problemCount: 1 },
          { name: 'problemTagSimulation', problemCount: 1 },
          { name: 'problemTagAnalyticGeometry', problemCount: 1 },
        ] as types.TagWithProblemCount[],
      },
    });

    expect(wrapper.text()).toContain(T.problemTagMatrices);
    expect(wrapper.text()).not.toContain(T.problemTagConditionals);
    expect(wrapper.find('input[value="problemTagArrays"]').exists()).toBe(true);
    expect(wrapper.find('input[value="problemTagConditionals"]').exists()).toBe(
      false,
    );
  });

  it('Should restore included and excluded tags and keep them mutually exclusive', async () => {
    const tagName = 'problemTagArrays';
    const wrapper = mount(problem_FilterTags, {
      propsData: {
        publicQualityTags: [] as types.TagWithProblemCount[],
        tags: [{ name: tagName, problemCount: 3 }],
        selectedTags: [tagName],
        selectedExcludedTags: [],
      },
    });

    const checkboxes = wrapper.findAll(
      '.tag-filter-row input[type="checkbox"]',
    );
    const include = checkboxes.at(0);
    const exclude = checkboxes.at(1);
    expect((include.element as HTMLInputElement).checked).toBe(true);
    expect((exclude.element as HTMLInputElement).checked).toBe(false);

    await exclude.setChecked(true);
    expect((include.element as HTMLInputElement).checked).toBe(false);
    expect((exclude.element as HTMLInputElement).checked).toBe(true);
    expect(wrapper.emitted('filters-changed')).toBeTruthy();

    await include.setChecked(true);
    expect((include.element as HTMLInputElement).checked).toBe(true);
    expect((exclude.element as HTMLInputElement).checked).toBe(false);
    const emittedFilters = wrapper.emitted('filters-changed');
    expect(emittedFilters?.[emittedFilters.length - 1][0]).toEqual({
      selected: [tagName],
      excluded: [],
    });
  });

  it('Should restore excluded tags from the collection URL state', () => {
    const tagName = 'problemTagArrays';
    const wrapper = mount(problem_FilterTags, {
      propsData: {
        publicQualityTags: [] as types.TagWithProblemCount[],
        tags: [{ name: tagName, problemCount: 3 }],
        selectedTags: [],
        selectedExcludedTags: [tagName],
      },
    });

    const checkboxes = wrapper.findAll(
      '.tag-filter-row input[type="checkbox"]',
    );
    expect((checkboxes.at(1).element as HTMLInputElement).checked).toBe(true);
  });
});
