// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  iconType: string;
  icon: string;
  class: string;
  groupTitle: boolean;
  active: boolean;
  badge: string;
  badgeClass: string;
  submenu: RouteInfo[];
}
