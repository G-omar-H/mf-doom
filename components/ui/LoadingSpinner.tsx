import Image from 'next/image'

interface LoadingSpinnerProps {
  size?: number
  className?: string
  text?: string
}

export default function LoadingSpinner({ 
  size = 48, 
  className = '', 
  text 
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="mb-4" style={{ width: size, height: size }}>
        <Image
          src="/icons/mfdoomcask.gif"
          alt="Loading..."
          width={size}
          height={size}
          className="w-full h-full"
          unoptimized
        />
      </div>
      {text && (
        <p className="text-gray-600 font-medium text-center">{text}</p>
      )}
    </div>
  )
} 