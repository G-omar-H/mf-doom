import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-black mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg text-mf-gray mb-8">
          The villain you seek has vanished into the shadows. 
          Perhaps try another path?
        </p>
        <div className="space-y-4">
          <Link href="/" className="btn-primary inline-block">
            Return Home
          </Link>
          <div>
            <Link href="/products" className="text-mf-dark-blue hover:underline">
              Browse Products
            </Link>
          </div>
        </div>
        <blockquote className="mt-12 text-sm text-mf-gray italic">
          "Lost like a remote in the couch cushions" — MF DOOM
        </blockquote>
      </div>
    </div>
  )
} 