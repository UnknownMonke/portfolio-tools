export interface MenuItem {
  label?: string,
  icon?: string,
  styleClass?: string,
  command?: (event?: any) => void;
  items?: MenuItem[]
}
