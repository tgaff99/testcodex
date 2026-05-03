import Foundation

struct DailyBrief: Equatable {
    let date: Date
    let priorities: [String]
    let meetingPrep: [String]
    let messagesNeedingReplies: [String]
    let decisionsOwed: [String]
    let fyis: [String]
    let accessGaps: [String]
}

struct ChangeUpdate: Identifiable, Equatable {
    let id = UUID()
    let timestamp: Date
    let title: String
    let detail: String
}

struct WorkContext {
    let calendarEvents: [String]
    let unreadDMsAndMentions: [String]
    let unreadEmails: [String]
    let openFollowUps: [String]
    let recentContext: [String]
    let unknowns: [String]
}
