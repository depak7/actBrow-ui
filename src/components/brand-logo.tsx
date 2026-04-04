import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

export type BrandLogoProps = {
  heightClassName?: string;
  widthClassName?: string;
  className?: string;
  imageClassName?: string;
  href?: string | null;
  priority?: boolean;
};

export function BrandLogo({
  heightClassName = 'h-4',
  widthClassName = 'w-auto',
  className,
  imageClassName,
  href = '/',
  priority = false,
}: BrandLogoProps) {
  const image = (
    <Image
      src={logo}
      alt="ActBrow"
      width={180}
      height={logo.height}
      className={cn('object-contain', widthClassName, heightClassName, imageClassName)}
    />
  );

  return (
    <Image
      src={logo}
      alt="ActBrow"
      width={180}
      height={logo.height}
      priority={priority}
    />
  );
}
