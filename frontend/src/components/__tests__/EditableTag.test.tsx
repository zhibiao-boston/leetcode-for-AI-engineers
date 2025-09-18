import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableTag from '../EditableTag';

describe('EditableTag', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with placeholder text when value is empty', () => {
    render(<EditableTag value="" onChange={mockOnChange} />);
    expect(screen.getByText('Add custom tag...')).toBeInTheDocument();
  });

  it('renders with value when provided', () => {
    render(<EditableTag value="test tag" onChange={mockOnChange} />);
    expect(screen.getByText('test tag')).toBeInTheDocument();
  });

  it('enters edit mode when clicked', () => {
    render(<EditableTag value="" onChange={mockOnChange} />);
    const tagElement = screen.getByText('Add custom tag...');
    fireEvent.click(tagElement);
    
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('saves changes when Enter is pressed', () => {
    render(<EditableTag value="" onChange={mockOnChange} />);
    const tagElement = screen.getByText('Add custom tag...');
    fireEvent.click(tagElement);
    
    const input = screen.getByDisplayValue('');
    fireEvent.change(input, { target: { value: 'new tag' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockOnChange).toHaveBeenCalledWith('new tag');
  });

  it('cancels changes when Escape is pressed', () => {
    render(<EditableTag value="original" onChange={mockOnChange} />);
    const tagElement = screen.getByText('original');
    fireEvent.click(tagElement);
    
    const input = screen.getByDisplayValue('original');
    fireEvent.change(input, { target: { value: 'modified' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(screen.getByText('original')).toBeInTheDocument();
  });

  it('respects maxLength prop', () => {
    render(<EditableTag value="" onChange={mockOnChange} maxLength={10} />);
    const tagElement = screen.getByText('Add custom tag...');
    fireEvent.click(tagElement);
    
    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('maxLength', '10');
  });
});
