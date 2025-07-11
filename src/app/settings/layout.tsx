import { SidebarNav } from '@/components/settings/sidebar-nav'

const sidebarNavItems = [
  {
    title: 'Organization',
    href: '/settings/organization',
  },
  {
    title: 'Users',
    href: '/settings/users',
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your organization settings and preferences.
        </p>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/4">
          <nav className="flex flex-col space-y-1">
            <SidebarNav items={sidebarNavItems} />
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-3xl">{children}</div>
      </div>
    </div>
  )
}
