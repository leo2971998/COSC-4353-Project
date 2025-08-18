/** @jest-environment jsdom */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Layout from '../components/Layout.jsx';
import { toast } from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  toast: jest.fn(),
}));

describe('Layout toast notifications', () => {
  beforeEach(() => {
    localStorage.clear();
    toast.mockClear();
  });

  test('displays flash messages via toast', async () => {
    localStorage.setItem('flashMessages', JSON.stringify(['Flash message']));
    render(React.createElement(Layout, null, React.createElement('div')));
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Flash message');
    });
  });

  test('displays prop notifications via toast', async () => {
    render(
      React.createElement(
        Layout,
        { notifications: ['Hello'] },
        React.createElement('div')
      )
    );
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Hello');
    });
  });
});
