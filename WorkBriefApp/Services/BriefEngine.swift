import Foundation

struct BriefEngine {
    var dataSource: WorkSignalsDataSource = MockWorkSignalsDataSource()

    func buildMorningBrief(now: Date) async -> DailyBrief {
        let context = await dataSource.fetchMorningContext(now: now)

        let priorities = derivePriorities(from: context)
        let meetingPrep = deriveMeetingPrep(from: context)
        let replies = context.unreadDMsAndMentions + context.unreadEmails
        let decisions = context.unreadDMsAndMentions.filter { $0.localizedCaseInsensitiveContains("decision") }

        return DailyBrief(
            date: now,
            priorities: priorities,
            meetingPrep: meetingPrep,
            messagesNeedingReplies: replies,
            decisionsOwed: decisions,
            fyis: context.recentContext,
            accessGaps: context.unknowns
        )
    }

    func getHourlyChanges(since: Date, now: Date) async -> [ChangeUpdate] {
        await dataSource.fetchIncrementalChanges(since: since, now: now)
    }

    func draftReplyIfClearNextStep(for update: ChangeUpdate) -> String? {
        let lower = update.detail.lowercased()
        guard lower.contains("approve") || lower.contains("confirm") || lower.contains("schedule") else {
            return nil
        }
        return "Draft reply: Acknowledged. I will \(update.detail.lowercased())."
    }

    private func derivePriorities(from context: WorkContext) -> [String] {
        var items = [String]()
        if let first = context.openFollowUps.first {
            items.append("Resolve top follow-up: \(first)")
        }
        if !context.calendarEvents.isEmpty {
            items.append("Prepare for today's key meetings")
        }
        if !context.unreadDMsAndMentions.isEmpty || !context.unreadEmails.isEmpty {
            items.append("Reply to urgent unread messages from the last 24h")
        }
        return items
    }

    private func deriveMeetingPrep(from context: WorkContext) -> [String] {
        context.calendarEvents.map { "Prep notes for \($0)" }
    }
}
