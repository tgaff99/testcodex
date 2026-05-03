import SwiftUI

struct ContentView: View {
    @ObservedObject var viewModel: BriefViewModel

    var body: some View {
        NavigationStack {
            List {
                Section("Status") {
                    LabeledContent("Workday", value: viewModel.workdayStatus)
                    LabeledContent("Last Check", value: viewModel.lastCheckLabel)
                    LabeledContent("Last Update", value: viewModel.lastUpdateLabel)
                }

                Section("Today's Brief") {
                    if let brief = viewModel.currentBrief {
                        BriefSectionView(title: "Priorities", items: brief.priorities)
                        BriefSectionView(title: "Meeting Prep", items: brief.meetingPrep)
                        BriefSectionView(title: "Needs Replies", items: brief.messagesNeedingReplies)
                        BriefSectionView(title: "Decisions Owed", items: brief.decisionsOwed)
                        BriefSectionView(title: "FYIs", items: brief.fyis)

                        if !brief.accessGaps.isEmpty {
                            BriefSectionView(title: "Access / Confirmation Gaps", items: brief.accessGaps)
                                .foregroundStyle(.orange)
                        }
                    } else {
                        Text("No brief yet. The app will generate one at the start of your workday.")
                            .foregroundStyle(.secondary)
                    }
                }

                if !viewModel.changeLog.isEmpty {
                    Section("Action Updates") {
                        ForEach(viewModel.changeLog.reversed()) { update in
                            VStack(alignment: .leading, spacing: 6) {
                                Text(update.title).font(.headline)
                                Text(update.detail).font(.subheadline)
                                Text(update.timestamp.formatted(date: .omitted, time: .shortened))
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Work Brief")
            .toolbar {
                Button("Check Now") {
                    Task { await viewModel.runHourlyCheck() }
                }
            }
        }
    }
}

private struct BriefSectionView: View {
    let title: String
    let items: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.headline)
            if items.isEmpty {
                Text("No items").foregroundStyle(.secondary)
            } else {
                ForEach(items, id: \.self) { item in
                    HStack(alignment: .top) {
                        Text("•")
                        Text(item)
                    }
                }
            }
        }
        .padding(.vertical, 4)
    }
}
