import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { pathToRegexp } from 'path-to-regexp';

export default function NavLink({ href, as, exact, children, ...props }: {
  href: string
  as?: string
  exact?: boolean
  children: (props: { isActive: boolean }) => React.ReactElement
}) {
  const { asPath } = useRouter();
  const isActive = pathToRegexp(as || href, [], { sensitive: true, end: !!exact }).test(asPath);

  return (
    <Link href={href} as={as} {...props}>
      {children({ isActive })}
    </Link>
  );
}
