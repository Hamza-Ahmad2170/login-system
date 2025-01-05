import z from "zod";

const refreshSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  accessToken: z.string(),
});

// type Refresh = z.infer<typeof refreshSchema>;

export { refreshSchema };
