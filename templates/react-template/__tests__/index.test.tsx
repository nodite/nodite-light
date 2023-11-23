import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import Component from '../src';

it('is accessible', async () => {
  const { container } = render(<Component>text</Component>);
  expect(await axe(container)).toHaveNoViolations();
});

it('renders text', () => {
  const text = 'text';
  render(<Component>{text}</Component>);
  expect(screen.getByText(text)).toBeInTheDocument();
});
