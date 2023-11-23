import Button from '@remarkable/button/src/Button';

export default {
  title: 'Example/RemarkableButton',
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
