/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';

describe('LoadingSpinner', () => {
  test('renders with provided text', () => {
    render(React.createElement(LoadingSpinner, { text: 'Loading...' }));
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fullScreen prop adds overlay', () => {
    const { container } = render(
      React.createElement(LoadingSpinner, { text: 'Please wait', fullScreen: true })
    );
    expect(container.firstChild).toHaveClass('fixed');
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });
});
