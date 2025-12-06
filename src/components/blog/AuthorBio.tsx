'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Twitter, Linkedin, Github, Globe } from 'lucide-react'
import { Author } from '@/lib/blog/types'

interface AuthorBioProps {
  author: Author
  variant?: 'inline' | 'card'
}

export default function AuthorBio({ author, variant = 'card' }: AuthorBioProps) {
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3">
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
            {author.name.charAt(0)}
          </div>
        )}
        <div>
          <Link href={`/blog/author/${author.id}`} className="font-medium text-gray-900 hover:text-blue-600">
            {author.name}
          </Link>
          <p className="text-sm text-gray-500">{author.role}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
      {author.avatar ? (
        <Image
          src={author.avatar}
          alt={author.name}
          width={80}
          height={80}
          className="rounded-full shrink-0"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {author.name.charAt(0)}
        </div>
      )}
      <div className="text-center sm:text-left">
        <Link href={`/blog/author/${author.id}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {author.name}
          </h3>
        </Link>
        <p className="text-blue-600 text-sm font-medium capitalize mb-2">{author.role}</p>
        {author.bio && (
          <p className="text-gray-600 mb-4">{author.bio}</p>
        )}
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <Twitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <Github size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <Globe size={20} />
          </a>
        </div>
      </div>
    </div>
  )
}
