import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z
        .object({
          src: z.string(),
          width: z.number(),
          height: z.number(),
          alt: z.string(),
          format: z.string(),
        }),
	}),
});

export const collections = { blog };
