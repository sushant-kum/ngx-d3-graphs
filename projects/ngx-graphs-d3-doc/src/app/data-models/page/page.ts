export interface Page {
  id: string;
  name?: string;
  disabled?: boolean;
  router_link?: string[];
  absolute_link?: string;
  icon_path?: string;
  items?: Page[];
}
