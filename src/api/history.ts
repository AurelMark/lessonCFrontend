import { typedFetch } from "@/lib/typedFetch"
import { HistoryLogsResponse, HistoryLogsResponseSchema } from "@/validation/history"

export const getHistoryLogs = (
    page?: number,
): Promise<HistoryLogsResponse> => {
    const params = new URLSearchParams()
    if (page) params.set('page', page.toString())

    return typedFetch(`/stats?${params.toString()}`, HistoryLogsResponseSchema)
}