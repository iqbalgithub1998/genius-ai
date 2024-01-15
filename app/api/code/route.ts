import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Configuration from 'openai';


const configuration = new Configuration({
    apiKey: process.env['OPENAI_API_KEY']
});

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
});

const instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: "Your are code generator. you must answer only in markdown code snippets. Use code comments for explanations."
}

export async function POST(
    req: Request
) {
    try {
        console.log("I am in backend");
        const { userId } = auth();
        const body = await req.json();
        const { message } = body;

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!configuration.apiKey) {
            console.log("[OPENAI API KEY NOT CONFIGURED]");
            return new NextResponse('AI model error', { status: 500 });
        }

        if (!message) {
            return new NextResponse('Message are required.', { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [instructionMessage, ...message]
        });
        // console.log(response);
        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return new NextResponse('Internal error', { status: 500 });
    }
}