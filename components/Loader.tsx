import Image from 'next/image'
import React from 'react'

function Loader() {
    return (
        <div
            className='h-full flex flex-col gap-x-4 items-center justify-center'
        >
            <div
                className='mb-4 w-10 h-10 relative animate-spin'
            >
                <Image
                    alt='logo'
                    fill
                    src="/logo.png"
                />
            </div>
            <p
                className='text-sm text-muted-foreground'
            >
                Genius is thinking...
            </p>
        </div>
    )
}

export default Loader