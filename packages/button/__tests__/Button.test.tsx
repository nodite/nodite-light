import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';

import Button from '../src';

it('is accessible', async () => {
  const { container } = render(<Button>text</Button>);
  expect(await axe(container)).toHaveNoViolations();
});

it('renders button with text', () => {
  const text = 'text';
  render(<Button>{text}</Button>);
  expect(screen.getByRole('button', { name: text })).toBeInTheDocument();
});
