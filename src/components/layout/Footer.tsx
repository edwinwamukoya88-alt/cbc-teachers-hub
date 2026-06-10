import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span>CBC Teachers Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered platform for Kenyan CBC teachers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/pricing">Pricing</Link>
              <Link href="/resources">Resources</Link>
              <Link href="/blog">Blog</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CBC Teachers Hub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
