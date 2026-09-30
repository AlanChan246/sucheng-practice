import type { ComponentProps } from 'react'
import { appPath } from '../lib/navigation'

export function AppLink({ to, ...props }: Omit<ComponentProps<'a'>, 'href'> & { to: string }) {
  return <a {...props} href={appPath(to)} />
}
