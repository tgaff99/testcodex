import SwiftUI

@main
struct WorkBriefApp: App {
    @StateObject private var viewModel = BriefViewModel(
        engine: BriefEngine(),
        scheduler: PollingScheduler()
    )

    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: viewModel)
                .task {
                    await viewModel.startWorkdayIfNeeded()
                }
        }
    }
}
