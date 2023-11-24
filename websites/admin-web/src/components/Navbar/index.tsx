import { NavBarCollapse } from './NavBarCollapse'
import { NavBarExpand } from './NavBarExpand'

interface SideNavbarProps {
  collapsed?: boolean
}
export function SideNavbar({ collapsed = false }: SideNavbarProps) {
  return collapsed ? <NavBarCollapse /> : <NavBarExpand />
}
