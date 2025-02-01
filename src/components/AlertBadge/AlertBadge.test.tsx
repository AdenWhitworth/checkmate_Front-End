import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertBadge from './AlertBadge';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AlertColor } from '@mui/material';

jest.mock('@mui/material/useMediaQuery');

jest.mock('@mui/material/Slide', () => {
  return ({ children, direction, timeout, in: inProp }: any) => {
    if (!inProp) {
      return <div data-testid="mock-slide" data-direction={direction} data-timeout={timeout} data-in="false" />;
    }
    return (
      <div data-testid="mock-slide" data-direction={direction} data-timeout={timeout} data-in="true">
        {children}
      </div>
    );
  };
});

describe('AlertBadge Component', () => {
  const mockedUseMediaQuery = useMediaQuery as jest.Mock<boolean>;

  const defaultProps = {
    severity: 'info' as AlertColor,
    text: 'This is an alert message.',
    onClose: jest.fn(),
    open: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when open is true on desktop', () => {
    mockedUseMediaQuery.mockReturnValue(false);

    render(<AlertBadge {...defaultProps} />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(defaultProps.text);
    expect(alert).toHaveClass('MuiAlert-standardInfo');

    const slide = screen.getByTestId('mock-slide');
    expect(slide).toHaveAttribute('data-direction', 'up');
    expect(slide).toHaveAttribute('data-timeout', '500');
    expect(slide).toHaveAttribute('data-in', 'true');

    expect(alert).toHaveStyle({
      position: 'fixed',
      marginLeft: '1vw',
      top: 'unset',
      bottom: '1vw',
      width: '98vw',
      zIndex: '200',
    });
  });

  test('renders correctly when open is true on mobile', () => {
    mockedUseMediaQuery.mockReturnValue(true);

    render(<AlertBadge {...defaultProps} />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(defaultProps.text);
    expect(alert).toHaveClass('MuiAlert-standardInfo');

    const slide = screen.getByTestId('mock-slide');
    expect(slide).toHaveAttribute('data-direction', 'down');
    expect(slide).toHaveAttribute('data-timeout', '500');
    expect(slide).toHaveAttribute('data-in', 'true');

    expect(alert).toHaveStyle({
      position: 'fixed',
      marginLeft: '5vw',
      top: '2vw',
      bottom: 'unset',
      width: '90vw',
      zIndex: '200',
    });
  });

  test('does not render when open is false', () => {
    mockedUseMediaQuery.mockReturnValue(false);

    render(<AlertBadge {...defaultProps} open={false} />);

    const alert = screen.queryByRole('alert');
    expect(alert).not.toBeInTheDocument();

    const slide = screen.getByTestId('mock-slide');
    expect(slide).toHaveAttribute('data-in', 'false');
  });

  test('renders with correct severity', () => {
    mockedUseMediaQuery.mockReturnValue(false);

    const { rerender } = render(<AlertBadge {...defaultProps} severity="success" />);
    let alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-standardSuccess');

    rerender(<AlertBadge {...defaultProps} severity="error" />);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-standardError');

    rerender(<AlertBadge {...defaultProps} severity="warning" />);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-standardWarning');
  });

  test('calls onClose when close button is clicked', () => {
    mockedUseMediaQuery.mockReturnValue(false);

    render(<AlertBadge {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('applies correct transition timeout', () => {
    mockedUseMediaQuery.mockReturnValue(false);

    render(<AlertBadge {...defaultProps} />);

    const slide = screen.getByTestId('mock-slide');
    expect(slide).toHaveAttribute('data-timeout', '500');
  });
});
