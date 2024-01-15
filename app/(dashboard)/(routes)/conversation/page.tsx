"use client";
import * as z from "zod";
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import Heading from "@/components/Heading";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/User-avatar";
import BotAvatar from "@/components/Bot-avatar";

function ConversationPage() {
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

            const response = await axios.post("/api/conversation", {
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
                title="Conversation"
                description="Our most advance conversation Model."
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
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
                                                placeholder="How do I calculate the radius of a circle?"
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
                                    <p className="text-sm">
                                        {message.content as string}

                                    </p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversationPage;
