'use client';
import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout } from 'lucide-react'
import Link from 'next/link'
import LoginCard from './login'
import SignupCard from './signup'

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState('login')

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="px-4 lg:px-6 h-16 flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white dark:bg-gray-800 shadow-md">
                <Link className="flex items-center justify-center" href="#">
                    <Layout className="h-9 w-9 text-white" />
                    <span className="sr-only">Kanban Todo</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <h2 className="scroll-m-20 pb-2 text-2xl font-bold tracking-tight first:mt-0">
                        Kanban-Todo
                    </h2>
                </nav>
            </header>
            <main className="flex-1">
            <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                    Boost Your Productivity with Todo Kanban
                                </h1>
                                <p className="mx-auto max-w-[700px] md:text-xl">
                                    Organize your tasks, streamline your workflow, and achieve more with our intuitive Kanban-style Todo application.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-8 md:py-16 lg:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-800 dark:text-gray-200">
                                    Get Started Today
                                </h2>
                                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Sign up or log in to start organizing your tasks and boosting your productivity.
                                </p>
                            </div>
                            <Card className="w-full max-w-md shadow-lg">
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="login">Login</TabsTrigger>
                                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
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