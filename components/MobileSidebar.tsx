"use client"
import React, { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

function MobileSidebar() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null;
    return (
        <Sheet>
            <SheetTrigger>
                <Button className='md:hidden' variant={"ghost"} size={"icon"}>
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent
                className='p-0'
                side="left"
            >
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar