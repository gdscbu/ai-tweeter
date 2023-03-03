/*
 *  Serverless function that generates a tweet given a few tokens.
 *  Created On 03 March 2023
 */

import { z } from 'zod'
import { Configuration, OpenAIApi } from 'openai'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const getPrompt = (tokens: string[]) => `Create a tweet with the following comma seperated tokens: ${tokens.join(', ')}`

const bodySchema = z.object({
    tokens: z.string().array()
})

export default async (req: VercelRequest, res: VercelResponse) => {
    // make sure it's a POST request
    if (req.method != 'POST') return res.status(405).json({
        message: 'method not allowed'
    })

    let body: z.infer<typeof bodySchema>

    try {
        body = bodySchema.parse(req.body)
    } catch {
        return res.status(400).json({
            message: 'bad request'
        })
    }

    const prompt = getPrompt(body.tokens)

    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    })

    const openai = new OpenAIApi(config)

    const tweets = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 200,
        n: 1
    })

    const tweet = tweets.data.choices[0]

    return res.status(200).json({
        prompt,
        tweet: tweet.message?.content.slice(1, -1).trim(),
    })
}