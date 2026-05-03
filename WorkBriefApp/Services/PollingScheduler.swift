import Foundation

protocol WorkdayScheduler {
    func isWorkday(now: Date) -> Bool
    func isWithinWorkdayHours(now: Date) -> Bool
    func nextHourlyInterval(now: Date) -> TimeInterval
}

struct PollingScheduler: WorkdayScheduler {
    private let calendar = Calendar.current
    private let startHour = 8
    private let endHour = 18

    func isWorkday(now: Date) -> Bool {
        let weekday = calendar.component(.weekday, from: now)
        return (2...6).contains(weekday)
    }

    func isWithinWorkdayHours(now: Date) -> Bool {
        let hour = calendar.component(.hour, from: now)
        return hour >= startHour && hour < endHour
    }

    func nextHourlyInterval(now: Date) -> TimeInterval {
        guard let nextHour = calendar.nextDate(after: now, matching: DateComponents(minute: 0), matchingPolicy: .nextTimePreservingSmallerComponents) else {
            return 3600
        }
        return max(60, nextHour.timeIntervalSince(now))
    }
}
