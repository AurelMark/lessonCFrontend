import { ZodSchema } from 'zod'
import { AxiosRequestConfig } from 'axios'
import customAxios from './customAxios'

export async function typedFetch<T>(
  url: string,
  schema: ZodSchema<T>,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await customAxios.request({
      url,
      method: config?.method || 'get',
      ...config,
    })

    const parsed = schema.safeParse(response.data)
    if (!parsed.success) {
      console.error(`❌ Validation failed for ${url}:`, parsed.error)
      throw new Error('Response validation failed')
    }

    return parsed.data
  } catch (err) {
    console.error(`❌ Request failed for ${url}:`, err)
    throw err
  }
}
