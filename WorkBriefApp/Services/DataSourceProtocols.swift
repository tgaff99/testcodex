import Foundation

protocol WorkSignalsDataSource {
    func fetchMorningContext(now: Date) async -> WorkContext
    func fetchIncrementalChanges(since: Date, now: Date) async -> [ChangeUpdate]
}

/// Replace with real integrations (EventKit, email provider SDK, Slack/Teams API, etc.).
struct MockWorkSignalsDataSource: WorkSignalsDataSource {
    func fetchMorningContext(now: Date) async -> WorkContext {
        WorkContext(
            calendarEvents: ["10:00 Product sync", "14:00 Customer escalation review"],
            unreadDMsAndMentions: ["@you: Need a decision on launch timing"],
            unreadEmails: ["Finance: Q2 budget variance question"],
            openFollowUps: ["Confirm onboarding timeline with Design", "Approve vendor security questionnaire"],
            recentContext: ["Ops incident from yesterday may shift priorities"],
            unknowns: [
                "Unable to verify private email labels without provider access token.",
                "Cannot confirm Slack channel threads unless workspace permission is granted."
            ]
        )
    }

    func fetchIncrementalChanges(since: Date, now: Date) async -> [ChangeUpdate] {
        // Placeholder: in production, return only truly new events.
        []
    }
}
