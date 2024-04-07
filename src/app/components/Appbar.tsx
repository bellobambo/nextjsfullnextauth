import { Button, Navbar, NavbarContent, NavbarItem } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

const Appbar = () => {
    return (
        <Navbar>



            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="/home">
                        Home
                    </Link>
                </NavbarItem>
            </NavbarContent>
            
            <NavbarContent justify="end">
        
                <NavbarItem>
                    <Button as={Link} color="primary" href="/auth/signup" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default Appbar