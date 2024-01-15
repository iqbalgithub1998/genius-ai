import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function LandingPage() {
    return (
        <div>
            LandingPage (unprotected)
            <div>
                <Link href="/sign-in">
                    <Button  >Login</Button>
                </Link>
                <Link href="/sign-up">
                    <Button variant="outline" >Register</Button>
                </Link>
            </div>
        </div>
    )
}

export default LandingPage