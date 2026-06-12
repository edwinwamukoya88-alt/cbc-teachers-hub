import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MobileNav } from '@/components/layout/MobileNav'

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      <MobileNav />
    </>
  )
}
