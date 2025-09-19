# Requirements Document

## Introduction

This feature adds a simple logging display to the Infinite Craft Helper control panel. Instead of capturing all console messages, it provides a dedicated logging API for the userscript to display applicative logs directly in the control panel. This eliminates the need to open Chrome DevTools and filter through browser console logs to see what the userscript is doing.

## Requirements

### Requirement 1

**User Story:** As a developer using the Infinite Craft Helper, I want to display applicative logs in the control panel, so that I can see what my userscript is doing without opening Chrome DevTools.

#### Acceptance Criteria

1. WHEN the control panel is displayed THEN the system SHALL include a dedicated logs section
2. WHEN the userscript calls a logging function THEN the system SHALL display the message in the logs section
3. WHEN logs are displayed THEN the system SHALL show timestamp and message content
4. WHEN multiple log entries exist THEN the system SHALL display them in chronological order with the newest at the top

### Requirement 2

**User Story:** As a user with limited screen space, I want to control the visibility of the logs section, so that it doesn't interfere with my gameplay.

#### Acceptance Criteria

1. WHEN the logs section is displayed THEN the system SHALL provide a way to collapse/expand the section
2. WHEN the logs section contains many entries THEN the system SHALL limit the display height and provide scrolling
3. WHEN the logs section is collapsed THEN the system SHALL show a summary indicator of recent activity
4. WHEN the control panel is dragged THEN the logs section SHALL move with the panel maintaining its state

### Requirement 3

**User Story:** As a user debugging issues, I want to copy logs to my clipboard, so that I can easily share them when asking for help.

#### Acceptance Criteria

1. WHEN the logs section is displayed THEN the system SHALL provide a "Copy" button
2. WHEN the Copy button is clicked THEN the system SHALL copy all visible logs to the clipboard in a readable format
3. WHEN logs are copied THEN the system SHALL provide visual feedback confirming the copy operation
4. WHEN no logs exist THEN the Copy button SHALL be disabled or show appropriate messaging

### Requirement 4

**User Story:** As a user, I want basic log management, so that I can clear logs when needed.

#### Acceptance Criteria

1. WHEN the logs section is displayed THEN the system SHALL provide a "Clear" button to manually remove all logs
2. WHEN logs are cleared THEN the system SHALL update the display immediately
3. WHEN the userscript is reloaded THEN the system SHALL start with an empty log history