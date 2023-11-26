import Button from '@nodite-light/button/src/Button';

export default {
  title: 'Example/NoditeChakraButton',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export const Text = {
  args: {
    children: 'Text',
  },
};
