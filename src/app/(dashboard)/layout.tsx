import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MobileNav } from '@/components/layout/MobileNav'

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      <MobileNav />
    </>
  )
}
