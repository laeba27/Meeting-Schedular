import React from 'react'
import SideNavbar from './_components/SideNavbar'
import DashboardHeader from './_components/DashboardHeader'
import { Toaster } from '../../../components/ui/sonner'
import { ThemeProvider } from "../../_utils/theme-provider"
function DashboardLayout({children}) {

  return (
    <div>
    <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
    <div className='hidden md:block md:w-64 border-r border-r-slate-100 h-screen fixed'>
        <SideNavbar/>
    </div>
    <div className='md:ml-64'>
        <DashboardHeader/>
        <Toaster/>
    {children}
    </div>
    </ThemeProvider>
</div>
)
}


export default DashboardLayout
