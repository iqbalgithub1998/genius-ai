"use client";
import * as z from "zod";
import React, { useState } from "react";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import ReactMarkdown from "react-markdown";

import { formSchema } from "./constants";
import Heading from "@/components/Heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import UserAvatar from "@/components/User-avatar";
import BotAvatar from "@/components/Bot-avatar";
import Image from "next/image";

function CodePage() {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        console.log(value);
        try {
            const userMessage: ChatCompletionMessageParam = {
                role: 'user',
                content: value.prompt
            }
            const newMessage = [...messages, userMessage];

            const response = await axios.post("/api/code", {
                message: newMessage,
            });
            setMessages((current) => [...current, userMessage, response.data]);
            form.reset();
        } catch (error: any) {
            // TODO:OPEN PRO MODEL
            console.log(error);

        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Code Generation"
                description="Generate Code using descriptive text."
                icon={Code}
                iconColor="text-green-700"
                bgColor="bg-green-700/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 "
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="Simple toggle button using React hooks."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="col-span-12 lg:col-span-2 w-full"
                                disabled={isLoading}
                            >
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div
                    className="space-y-4 mt-4 "
                >
                    {
                        isLoading && (
                            <div
                                className="p-8 rounded-lg w-full flex items-center justify-center bg-muted"
                            >
                                <Loader />
                            </div>
                        )
                    }
                    {
                        messages.length === 0 && !isLoading && (
                            <Empty label="No Conversation Started" />
                        )
                    }
                    <div
                        className="flex flex-col-reverse gap-y-4"
                    >
                        {
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={cn('p-8 w-full flex items-start gap-x-8 rounded-lg', message.role === 'user' ? 'bg-white border border-black/10' : 'bg-muted')}
                                >
                                    {
                                        message.role === 'user' ? <UserAvatar /> : <BotAvatar />
                                    }
                                    {/* <p className="text-sm">
                                        {message.content as string}
                                    </p> */}
                                    <ReactMarkdown
                                        components={{
                                            pre: ({ node, ...props }) => (
                                                <div className="my-2">
                                                    <div
                                                        className="w-full h-8 bg-gray-600 rounded-t-lg"
                                                    >
                                                    </div>
                                                    <div
                                                        className="overflow-auto w-full  bg-black/10 p-2 rounded-b-lg"
                                                    >

                                                        <pre {...props} />
                                                    </div>
                                                </div>
                                            ),
                                            code: ({ node, ...props }) => (
                                                <code className="bg-black/10 rounded-lg p-1" {...props} />
                                            )
                                        }}
                                        className='text-sm overflow-hidden leading-7'
                                    >
                                        {/* 
                                        // @ts-ignore */}
                                        {message.content || ''}
                                    </ReactMarkdown>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodePage;
