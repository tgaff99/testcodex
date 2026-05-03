# WorkBrief iOS App (Scaffold)

This scaffold implements the workflow you requested:

- Generates a morning brief on weekdays during work hours.
- Reviews calendar, unread DMs/mentions (24h), unread email (24h), open follow-ups, and recent context.
- Produces a concise brief with priorities, meeting prep, replies needed, decisions owed, and FYIs.
- Flags access/confirmation gaps.
- Runs hourly checks until end of workday and only surfaces updates when changes appear.
- Drafts replies only when next steps are clear.

## Wire in real data

Replace `MockWorkSignalsDataSource` with adapters for:

- EventKit (calendar)
- Email API/IMAP provider
- Slack/Teams API (DMs + mentions)
- Your follow-up task system (Notion, Linear, Todoist, etc.)

## Notes

- For production background behavior, add `BGTaskScheduler` and push/sync triggers.
- Add secure credential storage (Keychain) and per-provider OAuth.
