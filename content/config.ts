import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        category: z.enum(['casestudy', 'tutorial', 'thoughts']),
        lang: z.enum(['es', 'en', 'pt']).default('es'),
        image: z.string().optional()
    })
});

export const collections = { blog };
