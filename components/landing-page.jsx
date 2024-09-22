'use client';
import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout } from 'lucide-react'
import Link from 'next/link'
import LoginCard from './login'
import SignupCard from './signup'
import withAuthRedirect from './landing-page-HOC';

function LandingPage() {
    const [activeTab, setActiveTab] = useState('login')

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white dark:bg-gray-800 shadow-md">
                <Link className="flex items-center justify-center" href="#">
                    <Layout className="h-9 w-9 text-white" />
                    <span className="sr-only">Kanban Todo</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <h2 className="scroll-m-20 text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                        Kanban-Todo
                    </h2>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                                Boost Your Productivity with Todo Kanban
                            </h1>
                            <p className="mx-auto max-w-[700px] text-sm md:text-xl">
                                Organize your tasks, streamline your workflow, and achieve more with our intuitive Kanban-style Todo application.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Login/Signup Section */}
                <section className="w-full py-8 md:py-16 lg:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-800 dark:text-gray-200">
                                Get Started Today
                            </h2>
                            <p className="mx-auto max-w-[600px] text-sm md:text-xl text-gray-500 dark:text-gray-400">
                                Sign up or log in to start organizing your tasks and boosting your productivity.
                            </p>

                            {/* Card for Login and Signup Tabs */}
                            <Card className="w-full max-w-xs sm:max-w-md shadow-lg">
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-700">
                                        <TabsTrigger value="login" className="text-gray-800 dark:text-gray-200">Login</TabsTrigger>
                                        <TabsTrigger value="signup" className="text-gray-800 dark:text-gray-200">Sign Up</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="login">
                                        <LoginCard />
                                    </TabsContent>
                                    <TabsContent value="signup">
                                        <SignupCard />
                                    </TabsContent>
                                </Tabs>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default withAuthRedirect(LandingPage);
