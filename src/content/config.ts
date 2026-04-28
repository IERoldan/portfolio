import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        category: z.enum(['casestudy', 'tutorial', 'thoughts']),
        lang: z.enum(['es', 'en', 'pt']).default('es'),
        image: z.string().optional(),
        
        // SEO Localization / Overrides
        translationKey: z.string(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        canonical: z.string().url().optional(),
        noindex: z.boolean().default(false),
        alternates: z.record(z.string(), z.string()).optional(),
    })
});

export const collections = { blog };
