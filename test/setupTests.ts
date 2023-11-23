// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jest-axe adds custom jest matchers for testing accessibility.
// allows you to do things like:
// expect(await axe(container)).toHaveNoViolations()
// learn more: https://github.com/nickcolley/jest-axe
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
