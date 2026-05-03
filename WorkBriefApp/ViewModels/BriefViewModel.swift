import Foundation

@MainActor
final class BriefViewModel: ObservableObject {
    @Published var currentBrief: DailyBrief?
    @Published var changeLog: [ChangeUpdate] = []
    @Published var lastCheck: Date?
    @Published var lastUpdate: Date?

    private let engine: BriefEngine
    private let scheduler: WorkdayScheduler

    init(engine: BriefEngine, scheduler: WorkdayScheduler) {
        self.engine = engine
        self.scheduler = scheduler
    }

    var workdayStatus: String {
        scheduler.isWorkday(now: .now) ? "Weekday" : "Not a workday"
    }

    var lastCheckLabel: String { lastCheck?.formatted(date: .omitted, time: .shortened) ?? "Never" }
    var lastUpdateLabel: String { lastUpdate?.formatted(date: .omitted, time: .shortened) ?? "Never" }

    func startWorkdayIfNeeded() async {
        let now = Date()
        guard scheduler.isWorkday(now: now), scheduler.isWithinWorkdayHours(now: now) else { return }

        if currentBrief == nil || !Calendar.current.isDate(now, inSameDayAs: currentBrief!.date) {
            currentBrief = await engine.buildMorningBrief(now: now)
            lastUpdate = now
        }

        Task { await beginHourlyLoop() }
    }

    func runHourlyCheck() async {
        let now = Date()
        let since = lastCheck ?? now.addingTimeInterval(-3600)
        let changes = await engine.getHourlyChanges(since: since, now: now)
        lastCheck = now

        guard !changes.isEmpty else { return }

        for change in changes {
            changeLog.append(change)
            if let draft = engine.draftReplyIfClearNextStep(for: change) {
                changeLog.append(ChangeUpdate(timestamp: now, title: "Draft reply", detail: draft))
            }
        }

        lastUpdate = now
    }

    private func beginHourlyLoop() async {
        while true {
            let now = Date()
            guard scheduler.isWorkday(now: now), scheduler.isWithinWorkdayHours(now: now) else { break }
            try? await Task.sleep(nanoseconds: UInt64(scheduler.nextHourlyInterval(now: now) * 1_000_000_000))
            await runHourlyCheck()
        }
    }
}
