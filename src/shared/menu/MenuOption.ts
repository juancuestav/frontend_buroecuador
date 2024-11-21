export interface MenuOption {
  header?: string
  title?: string
  icon?: string
  link?: string
  target?: string
  children?: MenuOption[]
  can?: boolean
  parentTitle?: string
}
