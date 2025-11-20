export const shineAnimation = {
  animation: 'shine 1.5s linear infinite',
  background: `linear-gradient(to right, hsl(0, 0%, 30%) 0, hsl(0, 0%, 100%) 10%, hsl(0, 0%, 30%) 20%)`,
  backgroundSize: '600px',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  '@keyframes shine': {
    '0%': { backgroundPosition: '0' },
    '100%': { backgroundPosition: '600px' },
  },
};

export const fadeIn = {
  animation: 'fadeIn 0.8s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
};

export const bounce = {
  animation: 'bounce 1.2s infinite',
  '@keyframes bounce': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-8px)' },
  },
};

export const pulse = {
  animation: 'pulse 1.5s ease-in-out infinite',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
};

export const liftOnHover = {
  display: 'inline-block',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-6px)',
  },
};

export const liftWithBounce = {
  display: 'inline-block',
  transition: 'transform 0.3s cubic-bezier(0.25, 1.5, 0.5, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
};

export const slideInLeft = {
  animation: 'slideInLeft 0.8s ease-in-out',
  '@keyframes slideInLeft': {
    '0%': { transform: 'translateX(100%)', opacity: 0.1 },
    '100%': { transform: 'translateX(0)', opacity: 1 },
  },
};

export const slideInRight = {
  animation: 'slideInRight 0.8s ease-in-out',
  '@keyframes slideInRight': {
    '0%': { transform: 'translateX(-100%)', opacity: 0.1 },
    '100%': { transform: 'translateX(0)', opacity: 1 },
  },
};
