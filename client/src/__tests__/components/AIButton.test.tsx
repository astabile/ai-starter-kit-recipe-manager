import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AIButton } from '../../components/AIButton';

describe('AIButton', () => {
  it('renders with default text', () => {
    render(<AIButton onClick={vi.fn()} />);
    expect(screen.getByText('Get AI Classification')).toBeInTheDocument();
  });

  it('shows loading state when loading is true', () => {
    render(<AIButton onClick={vi.fn()} loading={true} />);
    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<AIButton onClick={vi.fn()} disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<AIButton onClick={handleClick} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<AIButton onClick={handleClick} disabled={true} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows spinner icon when loading', () => {
    const { container } = render(<AIButton onClick={vi.fn()} loading={true} />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows sparkle icon when not loading', () => {
    const { container } = render(<AIButton onClick={vi.fn()} loading={false} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
