export interface ChangeInfo {
  hasBackgroundChanges: boolean;
  hasContentChanges: boolean;
  hasPopupChanges: boolean;
  hasDevToolsChanges: boolean;
  timestamp: number;
} 