import React, { useEffect, useState } from 'react'

const STATUS_WORDS = [
  'Thinking',
  'Reasoning',
  'Analyzing',
  'Generating',
  'Composing',
]

function Loader() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % STATUS_WORDS.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='flex justify-start'>
      <div className='flex items-center gap-3 rounded-2xl rounded-tl-sm px-4 py-3'>
        <span
          key={index}
          className='text-sm text-slate-400 animate-word-fade'
        >
          {STATUS_WORDS[index]}
          <span className='animate-pulse'>...</span>
        </span>
        <div className='flex items-center gap-1.5'>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ animationDelay: `${i * 0.15}s` }}
              className='h-2 w-2 rounded-full bg-cyan-400 animate-dot-bounce'
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loader