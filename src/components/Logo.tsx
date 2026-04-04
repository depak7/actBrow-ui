import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeMap = {
    sm: 32,
    md: 36,
    lg: 40,
    xl: 64,
  };

  const containerSizeMap = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`${containerSizeMap[size]} rounded-lg bg-white/10 flex items-center justify-center overflow-hidden ${className}`}>
      <Image
        src="/assets/logo.svg"
        alt="ActBrow"
        width={sizeMap[size]}
        height={sizeMap[size]}
        className="object-contain"
        priority
      />
    </div>
  );
}
